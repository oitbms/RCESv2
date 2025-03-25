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

    private String urlTechBid = "192.168.0.67:2520/technologistbid/view/";

    private final RestTemplate restTemplate = new RestTemplate();

    private final String messageUrl = "https://api.telegram.org/bot%s/sendMessage?chat_id=%s&text=%s";

    private String message(Integer requestNumber, String employee, String customerOrder, String reason, Boolean image, String comment , Boolean isCreate) {
        return isCreate ? String.format("Создана новая заявка: %d\nОтветственный: %s\nЗаказ клиента: %s\n%s\nКомментарий: %s\nПричина: %s\nСсылка на заявку: %s",
                requestNumber, employee, customerOrder,image ? "Прикреплены  фото" : "Фото не прикреплены",comment!=null ? comment : "", reason, urlTechBid + requestNumber)
                : String.format("Заявка обновлена: %d\nОтветственный: %s\nЗаказ клиента: %s\n%s\nКомментарий: %s\nПричина: %s\nСсылка на заявку: %s ", requestNumber, employee, customerOrder, image ? "Прикреплены  фото" : "Фото не прикреплены", comment!=null ? comment : "", reason, urlTechBid + requestNumber);
    }

    public void sendMessageToGroup(Integer requestNumber, String employee, String customerOrder, Boolean image,String comment, String reason) {
        String url = String.format(messageUrl, botToken, chatId, message(requestNumber, employee, customerOrder, comment, image, reason, true));
        restTemplate.getForObject(url, String.class);
    }

    public void sendUpdateMessageToGroup(Integer requestNumber, String employee, String customerOrder, Boolean image,String comment, String reason) {
        String url = String.format(messageUrl, botToken, chatId, message(requestNumber, employee, customerOrder,reason, image, comment, false));
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
