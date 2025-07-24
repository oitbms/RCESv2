package com.example.rces.services;

import com.jayway.jsonpath.JsonPath;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpRequest.BodyPublishers;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
public class TokenService {

    private static final String TOKEN_URL = "http://localhost:8080/oauth/token";
    private static final String CLIENT_CREDENTIALS = "c3RkLWNsaWVudDo3NDA3MjE=";

    public String getToken(String username, String password) throws IOException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();

        String formData = "username=" + URLEncoder.encode(username, StandardCharsets.UTF_8)
                + "&password=" + URLEncoder.encode(password, StandardCharsets.UTF_8)
                + "&grant_type=password";

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(TOKEN_URL))
                .header("Accept", "application/json")
                .header("Authorization", "Basic " + CLIENT_CREDENTIALS)
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(BodyPublishers.ofString(formData))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 200) {
            String jsonBody = response.body();
            String accessToken = JsonPath.read(jsonBody, "$.access_token");
            return accessToken;
        } else {
            throw new RuntimeException("Не удалось получить токен: " + response.body());
        }
    }
}
