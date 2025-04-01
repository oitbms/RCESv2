package com.example.rces.services;

import com.example.rces.models.Employee;
import com.example.rces.models.base.EntityBase;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.KeyboardRow;

import java.util.ArrayList;
import java.util.List;

@Component
public class TelegramService extends TelegramLongPollingBot {

    @Autowired
    private UniversalService service;

    @Value("${telegram.bot.token}")
    private String botToken;

    @Value("${telegram.chat.id}")
    private String chatId;


    private final RestTemplate restTemplate = new RestTemplate();

    private final String messageUrl = "https://api.telegram.org/bot%s/sendMessage?chat_id=%s&text=%s";

    private String createdOrUpdatedMessage(Integer requestNumber, String employee, String customerOrder, String reason, Boolean image, String comment , Boolean isCreate, String bidUrl) {
        return isCreate ? String.format("Создана новая заявка: %d\nОтветственный: %s\nЗаказ клиента: %s\n%s\nКомментарий: %s\nПричина: %s\nСсылка на заявку: %s",
                requestNumber, employee, customerOrder,image ? "Прикреплены  фото" : "Фото не прикреплены",comment!=null ? comment : "", reason, "192.168.0.67:2520/" + bidUrl + "bid/view/" + requestNumber)
                : String.format("Заявка обновлена: %d\nОтветственный: %s\nЗаказ клиента: %s\n%s\nКомментарий: %s\nПричина: %s\nСсылка на заявку: %s ", requestNumber, employee, customerOrder, image ? "Прикреплены  фото" : "Фото не прикреплены", comment!=null ? comment : "", reason, "192.168.0.67:2520/" + bidUrl + "bid/view/" + requestNumber);
    }

    public void sendMessageToGroup(Integer requestNumber, String employee, String customerOrder, Boolean image,String comment, String reason, String bidUrl) {
        String url = String.format(messageUrl, botToken, "764495337", createdOrUpdatedMessage(requestNumber, employee, customerOrder, comment, image, reason, true, bidUrl));
        restTemplate.getForObject(url, String.class);
    }

    public void closeRequestMessage (Long userChatId) {
        String url = String.format(messageUrl, botToken, "764495337", "Заявка %d закрыта\n Оцените работу сотрудника");
        restTemplate.getForObject(url, String.class);
    }

    public void sendUpdateMessageToGroup(Integer requestNumber, String employee, String customerOrder, Boolean image,String comment, String reason, String bidUrl) {
        String url = String.format(messageUrl, botToken, chatId, createdOrUpdatedMessage(requestNumber, employee, customerOrder,reason, image, comment, false, bidUrl));
        restTemplate.getForObject(url, String.class);
    }

    private void sendMessageToUser(Integer requestNumber, String employee, String customerOrder, Boolean image,String comment, String reason, String bidUrl, String userChatId) {
        String url = String.format(messageUrl, botToken, userChatId, createdOrUpdatedMessage(requestNumber, employee, customerOrder,reason, image, comment, true, bidUrl));
        restTemplate.getForObject(url, String.class);
    }

    @Override
    public void onUpdateReceived(Update update) {
        if (update.hasMessage() && update.getMessage().hasText()) {
            Employee employee = service.findEmployeeByChatId(update.getMessage().getChatId());
            String message = update.getMessage().getText();
            if (message.matches("[1-5]")) {
                EntityBase.Appraisal score =  EntityBase.Appraisal.fromId(Integer.parseInt(message));
                String sa ="sasa";
            }
        }
    }

    private ReplyKeyboardMarkup createNumberKeyboard() {
        ReplyKeyboardMarkup keyboardMarkup = new ReplyKeyboardMarkup();
        keyboardMarkup.setResizeKeyboard(true);
        keyboardMarkup.setOneTimeKeyboard(true);
        List<KeyboardRow> keyboardRows = new ArrayList<>();
        KeyboardRow row = new KeyboardRow();
        for (int i = 1; i <= 5; i++) {
            row.add(String.valueOf(i));
        }
        keyboardRows.add(row);
        keyboardMarkup.setKeyboard(keyboardRows);
        return keyboardMarkup;
    }

    @Override
    public String getBotUsername() {
        return "BormashRequestBot";
    }

    @Override
    public String getBotToken() {
        return "8093920653:AAEG_Z_wcsBWg6iDqKHQnDY0bOWUOLULJlA";
    }
}
