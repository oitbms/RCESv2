package com.example.rces.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class TelegramService {

    @Value("${telegram.bot.token}")
    private String botToken;

    @Value("${telegram.chat.id}")
    private String chatId;

    private final RestTemplate restTemplate = new RestTemplate();

    private final String messageUrl = "https://api.telegram.org/bot%s/sendMessage?chat_id=%s&text=%s";

    private String message(Integer requestNumber, String employee, String customerOrder, String reason, Boolean isCreate) {
        return isCreate ? String.format("Создана новая заявка: %d\nОтветственный: %s\nЗаказ клиента: %s\nПричина: %s",
                requestNumber, employee, customerOrder, reason)
                : String.format("Заявка обновлена: %d\nОтветственный: %s\nЗаказ клиента: %s\nПричина: %s", requestNumber, employee, customerOrder, reason);
    }

    public void sendMessageToGroup(Integer requestNumber, String employee, String customerOrder, String reason) {
        String url = String.format(messageUrl, botToken, chatId, message(requestNumber, employee, customerOrder, reason, true));
        restTemplate.getForObject(url, String.class);
    }

    public void sendUpdateMessageToGroup(Integer requestNumber, String employee, String customerOrder, String reason) {
        String url = String.format(messageUrl, botToken, chatId, message(requestNumber, employee, customerOrder, reason, false));
        restTemplate.getForObject(url, String.class);
    }
}
