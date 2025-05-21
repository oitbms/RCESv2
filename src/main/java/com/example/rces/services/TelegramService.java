package com.example.rces.services;

import com.example.rces.models.Employee;
import com.example.rces.models.Requests;
import com.example.rces.models.SGI;
import com.example.rces.models.enums.Appraisal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import static com.example.rces.services.ServiceUtil.colorCalculate;

@Component
public class TelegramService extends TelegramLongPollingBot {

    @Autowired
    private UniversalService service;

    @Value("${telegram.bot.token}")
    private String botToken;

    @Value("${telegram.chat.constructor.id}")
    private String constructorGroupChatId;

    @Value("${telegram.chat.technologist.id}")
    private String technologistGroupChatId;

    @Value("${telegram.chat.otk.id}")
    private String otkGroupChatId;

    @Value("${telegram.chat.control.id}")
    private String controlChatId;

    @Value("${url.mobile}")
    private String urlMobile;

    @Value("${url.computer}")
    private String urlComputer;

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
                    urlMobile + "/view/" + request.getRequestNumber());
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
                    urlMobile + "/view/" + request.getRequestNumber());
        } else {
            return String.format("Заявка обновлена: %d \nОтветственный: %s %s\nЗаказ клиента: %s %s\n%s\nКомментарий: %s\nПричина: %s\nСтатус: %s\nСсылка на заявку: %s",
                    request.getRequestNumber(), request.getEmployee().getName(), request.getMlmNode().getName(),
                    request.getCustomerOrder().getName(), request.getItem().getName(),
                    !request.getImages().isEmpty() ? "Прикреплены  фото" : "Фото не прикреплены",
                    request.getComment() != null ? request.getComment() : "",
                    request.getReason() != null ? request.getReason().getName() : "Причина не указана",
                    request.getStatus().getName(),
                    urlMobile + "/view/" + request.getRequestNumber());
        }
    }

    public void sendMessageToGroup(Requests request) {
        String url = String.format(messageUrl, botToken,
                getGroupId(request.getTypeRequest().name()),
                createdOrUpdatedOrRedirectMessage(request, true, false));
        restTemplate.getForObject(url, String.class);
    }

    public void closeOrCanceledRequestMessage(Requests request, Employee updaterEmployee) {
        SendMessage sendMessage = new SendMessage();
        sendMessage.setChatId(getGroupId(request.getTypeRequest().name()));
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

    public void sendCompleted(Requests request) {
        restTemplate.getForObject(String.format(messageUrl, botToken, getGroupId(request.getTypeRequest().name()),
                "Заявка №" + request.getRequestNumber() + " Выполнена"), String.class);
    }

    private void sendScoreIsSave(Long chatId) {
        restTemplate.getForObject(String.format(messageUrl, botToken, chatId, "Оценка сохранена"), String.class);
    }

    public void sendUpdateMessageToGroup(Requests request) {
        String url = String.format(messageUrl, botToken, getGroupId(request.getTypeRequest().name()),
                createdOrUpdatedOrRedirectMessage(request, false, false));
        restTemplate.getForObject(url, String.class);
    }

    public void sendMessageToUser(Requests request, Long chatId, Boolean isCreate, Boolean isRedirect) {
        String url = String.format(messageUrl, botToken, chatId, createdOrUpdatedOrRedirectMessage(request, isCreate, isRedirect));
        restTemplate.getForObject(url, String.class);
    }

    public void sendMessageToControl(String requestsNumbers) {
        SendMessage sendMessage = new SendMessage();
        sendMessage.setChatId(controlChatId);
        sendMessage.setText("Срок выполнения мероприятий №" + requestsNumbers + " истекает через 2 дня");
        try {
            execute(sendMessage);
        } catch (TelegramApiException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void onUpdateReceived(Update update) {
        if (update.hasMessage() && update.getMessage().hasText() && update.getMessage().isReply()) {
            Employee employee = service.findSingleByField(Employee.class, "chatId", update.getMessage().getChatId());
            String message = update.getMessage().getText();
            try {
                if (message.matches("[1-5]")) {
                    Appraisal score = Appraisal.fromId(Integer.parseInt(message));
                    Requests request = service.findSingleByField(Requests.class, "messageId", update.getMessage().getReplyToMessage().getMessageId());
                    request.setScore(score);
                    service.save(request);
                    sendScoreIsSave(request.getChatId());
                }
            } catch (Exception ignored) {

            }
        }
    }

    @Scheduled(cron = "0 0 9 * * *") // каждый день в 09:00
    @Transactional
    public void notifyExpiredDeviations() {
        LocalDate today = LocalDate.now();
        List<SGI> sgiList = service.findAll(SGI.class);
        StringBuilder requestsNumbers = new StringBuilder();
        for (SGI sgi : sgiList) {
            sgi.setColor(colorCalculate(sgi, today));
            if (sgi.getColor().equals(SGI.ColorSGI.RED))
                requestsNumbers.append(!requestsNumbers.isEmpty() ? ", " : "").append(sgi.getRequestNumber());
        }
        if (!requestsNumbers.toString().isBlank()) {
            sendMessageToControl(requestsNumbers.toString());
        }
    }


    private String getGroupId(String typeRequest) {
        return switch (typeRequest) {
            case "constructor" -> constructorGroupChatId;
            case "otk" -> otkGroupChatId;
            case "technologist" -> technologistGroupChatId;
            default -> throw new IllegalStateException("Unexpected value: " + typeRequest);
        };
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
