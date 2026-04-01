package com.example.rces.service.impl;

import com.example.rces.dto.MaxMessageRequest;
import com.example.rces.dto.MaxMessageResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.*;

@Service
public class MaxUserBotClient {

    private static final Logger log = LoggerFactory.getLogger(MaxUserBotClient.class);

    private final RestTemplate restTemplate;
    private final String baseUrl;

    public MaxUserBotClient(@Value("${max.userbot.url}") String baseUrl) {
        this.restTemplate = new RestTemplate();
        this.baseUrl = baseUrl;
    }

    public void sendMessage(Long userId, String message) {
        MaxMessageRequest request = new MaxMessageRequest(userId, message);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<MaxMessageRequest> entity = new HttpEntity<>(request, headers);

        try {
            restTemplate.postForEntity(
                    baseUrl + "/send",
                    entity,
                    MaxMessageResponse.class
            );

        } catch (ResourceAccessException e) {
            log.error("MAX-bot не доступен message - {}", e.getMessage());
        } catch (HttpServerErrorException e) {
            log.error("MAX-bot вернул ошибку сервера: статус={}, тело={}",
                    e.getStatusCode(), e.getResponseBodyAsString());
        } catch (RestClientException e) {
            log.error("Ошибка при вызове MAX-bot: {}", e.getMessage());
        }
    }

    public boolean healthCheck() {
        try {
            ResponseEntity<HealthResponse> response = restTemplate.getForEntity(
                    baseUrl + "/",
                    HealthResponse.class
            );
            return response.getBody() != null && Boolean.TRUE.equals(response.getBody().connected);
        } catch (Exception e) {
            log.warn("MAX UserBot недоступен: {}", e.getMessage());
            return false;
        }
    }

    private static class HealthResponse {
        public Boolean connected;
    }
}
