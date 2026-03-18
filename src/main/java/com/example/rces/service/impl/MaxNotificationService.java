package com.example.rces.service.impl;

import com.example.rces.dto.MaxMessageResponse;
import com.example.rces.models.Requests;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class MaxNotificationService {

    private static final Logger log = LoggerFactory.getLogger(MaxNotificationService.class);
    private final MaxUserBotClient maxUserBotClient;

    public MaxNotificationService(MaxUserBotClient maxUserBotClient) {
        this.maxUserBotClient = maxUserBotClient;
    }

    @PostConstruct
    public void init() {
        boolean connected = maxUserBotClient.healthCheck();
        if (connected) {
            log.info("MAX UserBot подключен");
        } else {
            log.warn("MAX UserBot недоступен. Убедитесь, что Python-сервер запущен на порту 8080");
        }
    }

    public void sendNotification(Requests requests) {
        Long chatId = getChatId(requests);
        if (chatId == null) {
            log.warn("Не указан MAX chatId");
            return;
        }

        String message = buildMessage(requests);
        if (message == null) return;

        maxUserBotClient.sendMessage(chatId, message);
    }

    public void sendRedirectNotification(Requests requests) {
        Long chatId = requests.getEmployee().getChatId();
        if (chatId == null) {
            log.warn("Не указан MAX chatId");
            return;
        }

        String message = String.format(
                "Заявка #%d перенаправлена на %s",
                requests.getRequestNumber(),
                requests.getEmployee().getName()
        );

        maxUserBotClient.sendMessage(chatId, message);
    }

    private Long getChatId(Requests requests) {
        return switch (requests.getStatus()) {
            case New -> requests.getEmployee().getChatId();
            case InWork, Rejected, Closed -> requests.getCreatedBy().getChatId();
            case Cancel,Completed,UnderRework -> null;
        };
    }

    private String buildMessage(Requests requests) {
        return switch (requests.getStatus()) {
            case New -> String.format("""
                                Заявка с номером - %d успешно создана!
                                Ответственный - %s
                                Цех - %s
                                Тип ТМЦ - %s
                                Заказ клиента - %s
                                Причина - %s
                                Перейти к заявке -> http://web.bormash.ru:2005/view/%d
                                """, requests.getRequestNumber(), requests.getEmployee().getName(),
                    requests.getSubDivision().getName(), requests.getItem() == null ? "не указан" : requests.getItem().getName(), requests.getCustomerOrder().getName(),
                    requests.getReason() == null ? "не указана" : requests.getReason(),requests.getRequestNumber());

            case InWork -> "Заявка с номером " + requests.getRequestNumber() + " в работе";
            case Closed -> "Заявка с номером " + requests.getRequestNumber() + " завершена";
            case Rejected -> "Заявка с номером " + requests.getRequestNumber() + " забракована";
            case Cancel,Completed,UnderRework -> null;
        };
    }
}
