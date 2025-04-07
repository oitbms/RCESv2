package com.example.rces.services;

import com.example.rces.models.Employee;
import com.example.rces.models.Requests;
import com.example.rces.models.enums.Appraisal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import java.time.LocalDateTime;

@Component
public class TelegramService extends TelegramLongPollingBot {

    @Autowired
    private UniversalService service;

    @Value("${telegram.bot.token}")
    private String botToken;

    @Value("${telegram.chat.id}")
    private String constructorGroupChatId;

    private final RestTemplate restTemplate = new RestTemplate();

    private final String messageUrl = "https://api.telegram.org/bot%s/sendMessage?chat_id=%s&text=%s";

    private String createdOrUpdatedOrRedirectMessage(Requests request, Boolean isCreate, Boolean isRedirect) {
        if (isCreate) {
            return String.format("Создана новая заявка: %d\nОтветственный: %s%s\nЗаказ клиента: %s%s\n%s\nКомментарий: %s\nПричина: %s\nСсылка на заявку: %s",
                    request.getRequestNumber(), request.getEmployee().getName(),
                    request.getMlmNode() != null ? "\nЦех: " + request.getMlmNode().getName() : "",
                    request.getCustomerOrder().getName(),
                    request.getItem() != null ? "\nТип ТМЦ: " + request.getItem().getName() : "",
                    !request.getImages().isEmpty() ? "Прикреплены  фото" : "Фото не прикреплены",
                    request.getComment() != null ? request.getComment() : "",
                    request.getReason() != null ? request.getReason().getName() : "Причина не указана",
                    "192.168.0.67:2520/view/" + request.getRequestNumber());
        } else if (isRedirect) {
            return String.format("%s переадресовал заявку %d в вашу ответственность \nОтветственный: %s%s\nЗаказ клиента: %s%s\n%s\nКомментарий: %s\nПричина: %s\nСсылка на заявку: %s",
                    request.getUpdateBy().getName(),
                    request.getRequestNumber(), request.getEmployee().getName(),
                    request.getMlmNode() != null ? "\nЦех: " + request.getMlmNode().getName() : "",
                    request.getCustomerOrder().getName(),
                    request.getItem() != null ? "\nТип ТМЦ: " + request.getItem().getName() : "",
                    !request.getImages().isEmpty() ? "Прикреплены  фото" : "Фото не прикреплены",
                    request.getComment() != null ? request.getComment() : "",
                    request.getReason() != null ? request.getReason().getName() : "Причина не указана",
                    "192.168.0.67:2520/view/" + request.getRequestNumber());
        } else {
            return String.format("Заявка обновлена: %d\nОтветственный: %s%s\nЗаказ клиента: %s%s\n%s\nКомментарий: %s\nПричина: %s\nСсылка на заявку: %s",
                    request.getRequestNumber(), request.getEmployee().getName(), request.getMlmNode().getName(),
                    request.getCustomerOrder().getName(), request.getItem().getName(),
                    !request.getImages().isEmpty() ? "Прикреплены  фото" : "Фото не прикреплены",
                    request.getComment() != null ? request.getComment() : "",
                    request.getReason() != null ? request.getReason().getName() : "Причина не указана",
                    "192.168.0.67:2520/view/" + request.getRequestNumber());
        }
    }

    public void sendMessageToGroup(Requests request) {
        String url = String.format(messageUrl, botToken, "764495337", createdOrUpdatedOrRedirectMessage(request, true, false));
        restTemplate.getForObject(url, String.class);
    }

    public void closeOrCanceledRequestMessage(Requests request, Employee updaterEmployee) {
        SendMessage sendMessage = new SendMessage();
        sendMessage.setChatId(request.getCreatedBy().getChatId());
        sendMessage.setText(String.format("Заявка № %d %s\nОписание: %s\nОцените работу сотрудника (от 1 до 5)", request.getRequestNumber(), request.getStatus().getName() + "a", request.getDescription()));
        try {
            Message message = execute(sendMessage);

            request.setCloseDate(LocalDateTime.now());
            request.setClosedEmployee(updaterEmployee);
            request.setChatId(message.getChatId());
            request.setMessageId(message.getMessageId());

            service.save(request);
        } catch (TelegramApiException e) {
            throw new RuntimeException(e);
        }
    }

    private void sendScoreIsSave(Long chatId) {
        restTemplate.getForObject(String.format(messageUrl, botToken, chatId, "Оценка сохранена"), String.class);
    }

    public void sendUpdateMessageToGroup(Requests request, String bidUrl) {
        String url = String.format(messageUrl, botToken, constructorGroupChatId, createdOrUpdatedOrRedirectMessage(request, false, false));
        restTemplate.getForObject(url, String.class);
    }

    public void sendMessageToUser(Requests request, Long chatId, Boolean isRedirect) {
        String url = String.format(messageUrl, botToken, chatId, createdOrUpdatedOrRedirectMessage(request, true, isRedirect));
        restTemplate.getForObject(url, String.class);
    }

    @Override
    public void onUpdateReceived(Update update) {
        if (update.hasMessage() && update.getMessage().hasText() && update.getMessage().isReply()) {
            Employee employee = service.findEmployeeByChatId(update.getMessage().getChatId());
            String message = update.getMessage().getText();
            if (message.matches("[1-5]")) {
                Appraisal score = Appraisal.fromId(Integer.parseInt(message));
                Requests request = service.findAllByField(Requests.class, "messageId", update.getMessage().getReplyToMessage().getMessageId()).get(0);
                request.setScore(score);
                service.save(request);
                sendScoreIsSave(request.getChatId());
            }
        }
    }

//    private ReplyKeyboardMarkup createNumberKeyboard() {
//        ReplyKeyboardMarkup keyboardMarkup = new ReplyKeyboardMarkup();
//        keyboardMarkup.setResizeKeyboard(true);
//        keyboardMarkup.setOneTimeKeyboard(true);
//        keyboardMarkup.setSelective(true);
//        List<KeyboardRow> keyboardRows = new ArrayList<>();
//        KeyboardRow row = new KeyboardRow();
//        for (int i = 1; i <= 5; i++) {
//            row.add(String.valueOf(i));
//        }
//        keyboardRows.add(row);
//        keyboardMarkup.setKeyboard(keyboardRows);
//        return keyboardMarkup;
//    }

    @Override
    public String getBotUsername() {
        return "BormashRequestBot";
    }

    @Override
    public String getBotToken() {
        return "8093920653:AAEG_Z_wcsBWg6iDqKHQnDY0bOWUOLULJlA";
    }
}
