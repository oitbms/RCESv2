package com.example.rces.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.objects.Update;

@Component
public class TelegramService extends TelegramLongPollingBot {

    @Value("${telegram.bot.token}")
    private String botToken;

    @Value("${telegram.chat.id}")
    private String chatId;

    private final RestTemplate restTemplate = new RestTemplate();

    private final String messageUrl = "https://api.telegram.org/bot%s/sendMessage?chat_id=%s&text=%s";

    private String message(Integer requestNumber, String employee, String customerOrder, String reason, String comment, Boolean isCreate) {
        String baseMessage = isCreate
                ? String.format("Создана новая заявка: %d\nОтветственный: %s\nЗаказ клиента: %s\nКомментарий: %s",
                requestNumber, employee, customerOrder, comment != null ? comment : "")
                : String.format("Заявка обновлена: %d\nОтветственный: %s\nЗаказ клиента: %s\nКомментарий: %s",
                requestNumber, employee, customerOrder, comment != null ? comment : "");

        if (reason != null && !"Нет причины".equals(reason)) {
            baseMessage += String.format("\nПричина: %s", reason);
        }

        return baseMessage;
    }

    public void sendMessageToGroup(Integer requestNumber, String employee, String customerOrder,String comment, String reason) {
        String url = String.format(messageUrl, botToken, chatId, message(requestNumber, employee, customerOrder, comment, reason, true));
        restTemplate.getForObject(url, String.class);
    }

    public void sendUpdateMessageToGroup(Integer requestNumber, String employee, String customerOrder,String comment, String reason) {
        String url = String.format(messageUrl, botToken, chatId, message(requestNumber, employee, customerOrder,reason, comment, false));
        restTemplate.getForObject(url, String.class);
    }

    @Override
    public void onUpdateReceived(Update update) {
        if (update.hasMessage() && update.getMessage().hasText()) {

        }
    }

    @Override
    public String getBotUsername() {
        return "BormashRequestBot";
    }

    @Override
    public String getBotToken() {
        return botToken;
    }
}
