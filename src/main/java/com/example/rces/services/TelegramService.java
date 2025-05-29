package com.example.rces.services;

import com.example.rces.models.Employee;
import com.example.rces.models.Requests;
import com.example.rces.models.SGI;
import com.example.rces.models.enums.Appraisal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContextException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
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
import java.util.UUID;

import static com.example.rces.services.ServiceUtil.colorCalculate;
import static org.apache.commons.lang3.ObjectUtils.defaultIfNull;

@Component
public class TelegramService extends TelegramLongPollingBot {

    @Autowired
    private UniversalService service;

    @Autowired
    CustomUserDetailsService userDetailsService;

    @Value("${telegram.bot.token}")
    private String botToken;

    @Value("${telegram.chat.constructor.id}")
    private String constructorGroupChatId;

    @Value("${telegram.chat.technologist.id}")
    private String technologistGroupChatId;

//    @Value("${telegram.chat.otk.id}")
//    private String otkGroupChatId;

    @Value("${telegram.chat.control.id}")
    private String controlChatId;

    @Value("${url.mobile}")
    private String urlMobile;

    @Value("${url.computer}")
    private String urlComputer;

    private final RestTemplate restTemplate = new RestTemplate();

    private final String baseMessageUrl = "https://api.telegram.org/bot%s/sendMessage?chat_id=%s&text=%s";

    public String typeMessageUrl(Employee empl) {
        Employee employee = service.findById(Employee.class,empl.getId());
        if (employee.getRole().equals("CONSTRUCTOR")) {
            return "https://api.telegram.org/bot%s/sendMessage?chat_id=%s&message_thread_id=2343&text=%s";
        } else {
            return baseMessageUrl;
        }
    }

    private String createdOrUpdatedOrRedirectMessage(Requests request, String typeMessage) {
        switch (typeMessage) {
            case "create" -> {
                return String.format("Создана новая заявка: %d\nОтветственный: %s%s\nЗаказ клиента: %s%s\n%s\nКомментарий: %s\nПричина: %s\nСсылка на заявку: %s",
                        request.getRequestNumber(), request.getEmployee().getName(),
                        request.getMlmNode() != null ? "\nЦех: " + request.getMlmNode().getName() : "",
                        request.getCustomerOrder().getName(),
                        request.getItem() != null ? "\nТип ТМЦ: " + request.getItem().getName() : "",
                        !request.getImages().isEmpty() ? "Прикреплены  фото" : "Фото не прикреплены",
                        request.getComment() != null ? request.getComment() : "",
                        request.getReason() != null ? request.getReason().getName() : "Причина не указана",
                        urlMobile + "/view/" + request.getRequestNumber());
            }
            case "redirect" -> {
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
            }
            case "update" -> {
                return String.format("Заявка обновлена: %d \nОтветственный: %s %s\nЗаказ клиента: %s %s\n%s\nКомментарий: %s\nПричина: %s\nСтатус: %s\nСсылка на заявку: %s",
                        request.getRequestNumber(), request.getEmployee().getName(), request.getMlmNode().getName(),
                        request.getCustomerOrder().getName(), request.getItem().getName(),
                        !request.getImages().isEmpty() ? "Прикреплены  фото" : "Фото не прикреплены",
                        request.getComment() != null ? request.getComment() : "",
                        request.getReason() != null ? request.getReason().getName() : "Причина не указана",
                        request.getStatus().getName(),
                        urlMobile + "/view/" + request.getRequestNumber());
            }
            default -> throw new ApplicationContextException("Неправильный тип сообщения");
        }
    }

    public void sendMessageToGroup(Requests request) {
        String url = String.format(typeMessageUrl(request.getEmployee()), botToken,
                getGroupId(request.getTypeRequest().name()),
                createdOrUpdatedOrRedirectMessage(request, "create"));
        restTemplate.getForObject(url, String.class);
    }

    public void closeOrCanceledRequestMessage(Requests request, Employee updaterEmployee) {
        SendMessage sendMessage = new SendMessage();
        sendMessage.setChatId(updaterEmployee.getChatId());
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
//        String chatId = defaultIfNull(getGroupId(request.getTypeRequest().name()), String.valueOf(request.getCreatedBy().getChatId()));
        restTemplate.getForObject(String.format(typeMessageUrl(request.getEmployee()), botToken, request.getCreatedBy().getChatId(),
                "Заявка №" + request.getRequestNumber() + " Выполнена"), String.class);
    }

    private void sendScoreIsSave(Requests requests) {
        restTemplate.getForObject(String.format(typeMessageUrl(requests.getEmployee()), botToken, requests.getChatId(), "Оценка сохранена"), String.class);
    }

    public void sendUpdateMessageToGroup(Requests request) {
//        String chatId = defaultIfNull(getGroupId(request.getTypeRequest().name()), String.valueOf(request.getCreatedBy().getChatId()));
        String url = String.format(typeMessageUrl(request.getEmployee()), botToken, request.getCreatedBy().getChatId(),
                createdOrUpdatedOrRedirectMessage(request, "update"));
        restTemplate.getForObject(url, String.class);
    }

    public void sendMessageToUser(Requests request, Long chatId, String messageType) {
        String url = String.format(typeMessageUrl(request.getEmployee()), botToken, chatId, createdOrUpdatedOrRedirectMessage(request, messageType));
        restTemplate.getForObject(url, String.class);
    }

    private void sendMessageToControl(String requestsNumbers) {
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
    @Transactional
    public void onUpdateReceived(Update update) {
        if (update.hasMessage() && update.getMessage().hasText() && update.getMessage().isReply()) {
            Employee employee = service.findSingleByField(Employee.class, "chatId", update.getMessage().getChatId());
            String message = update.getMessage().getText();
            if (message.matches("[1-5]")) {
                Appraisal score = Appraisal.fromId(Integer.parseInt(message));
                Requests request = service.findSingleByField(Requests.class, "messageId", update.getMessage().getReplyToMessage().getMessageId());
                request.setScore(score);
                Authentication anonymousAuth = new AnonymousAuthenticationToken(
                        UUID.randomUUID().toString(),
                        employee.getName(),
                        List.of(new SimpleGrantedAuthority(employee.getRole())));
                SecurityContext context = SecurityContextHolder.createEmptyContext();
                context.setAuthentication(anonymousAuth);
                SecurityContextHolder.setContext(context);
                service.save(request);
                sendScoreIsSave(request);
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
//            case "otk" -> otkGroupChatId;
            case "technologist" -> technologistGroupChatId;
            default -> null;
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

//  sendMessage.setText(String.format("Заявка № %d %s\nОписание: %s\nОцените работу сотрудника (от 1 до 5)", request.getRequestNumber(), request.getStatus().getName() + "a", request.getDescription()));
//  sendMessage.setText(String.format("Заявка № %d %s", request.getRequestNumber(), request.getStatus().getName()));