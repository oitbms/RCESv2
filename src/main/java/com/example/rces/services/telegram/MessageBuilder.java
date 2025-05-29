package com.example.rces.services.telegram;

import com.example.rces.models.Requests;

public class MessageBuilder {
    private final String baseUrl;

    public MessageBuilder(String baseUrl) {
        this.baseUrl = baseUrl;
    }

    public String buildRequestMessage(Requests request, MessageType type) {
        switch (type) {
            case CREATE:
                return buildCreateMessage(request);
            case UPDATE:
                return buildUpdateMessage(request);
            case REDIRECT:
                return buildRedirectMessage(request);
            default:
                throw new IllegalArgumentException("Unsupported message type");
        }
    }

    private String buildCreateMessage(Requests request) {
        return String.format(
                "Создана новая заявка: %d\nОтветственный: %s%s\nЗаказ клиента: %s%s\n%s\nКомментарий: %s\nПричина: %s\nСсылка на заявку: %s",
                request.getRequestNumber(),
                request.getEmployee().getName(),
                request.getMlmNode() != null ? "\nЦех: " + request.getMlmNode().getName() : "",
                request.getCustomerOrder().getName(),
                request.getItem() != null ? "\nТип ТМЦ: " + request.getItem().getName() : "",
                !request.getImages().isEmpty() ? "Прикреплены фото" : "Фото не прикреплены",
                request.getComment() != null ? request.getComment() : "",
                request.getReason() != null ? request.getReason().getName() : "Причина не указана",
                baseUrl + "/view/" + request.getRequestNumber());
    }

    private String buildUpdateMessage(Requests request) {
        return String.format(
                "Заявка обновлена: %d \nОтветственный: %s %s\nЗаказ клиента: %s %s\n%s\nКомментарий: %s\nПричина: %s\nСтатус: %s\nСсылка на заявку: %s",
                request.getRequestNumber(),
                request.getEmployee().getName(),
                request.getMlmNode().getName(),
                request.getCustomerOrder().getName(),
                request.getItem().getName(),
                !request.getImages().isEmpty() ? "Прикреплены фото" : "Фото не прикреплены",
                request.getComment() != null ? request.getComment() : "",
                request.getReason() != null ? request.getReason().getName() : "Причина не указана",
                request.getStatus().getName(),
                baseUrl + "/view/" + request.getRequestNumber());
    }

    private String buildRedirectMessage(Requests request) {
        return String.format(
                "%s переадресовал заявку %d в вашу ответственность \nОтветственный: %s%s\nЗаказ клиента: %s%s\n%s\nКомментарий: %s\nПричина: %s\nСсылка на заявку: %s",
                request.getUpdateBy().getName(),
                request.getRequestNumber(),
                request.getEmployee().getName(),
                request.getMlmNode() != null ? "\nЦех: " + request.getMlmNode().getName() : "",
                request.getCustomerOrder().getName(),
                request.getItem() != null ? "\nТип ТМЦ: " + request.getItem().getName() : "",
                !request.getImages().isEmpty() ? "Прикреплены фото" : "Фото не прикреплены",
                request.getComment() != null ? request.getComment() : "",
                request.getReason() != null ? request.getReason().getName() : "Причина не указана",
                baseUrl + "/view/" + request.getRequestNumber());
    }
}