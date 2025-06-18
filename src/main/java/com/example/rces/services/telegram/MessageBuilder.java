package com.example.rces.services.telegram;

import com.example.rces.configuration.AppProperties;
import com.example.rces.models.Requests;
import com.example.rces.models.SGI;

import static com.example.rces.services.ServiceUtil.formatedDate;

public class MessageBuilder {
    private final String baseUrl;

    public MessageBuilder(String baseUrl) {
        this.baseUrl = baseUrl;
    }

    public String buildRequestMessage(Requests request, MessageType type) {
        return switch (type) {
            case CREATE -> buildCreateMessage(request);
            case UPDATE -> buildUpdateMessage(request);
            case REDIRECT -> buildRedirectMessage(request);
            case CLOSE -> buildCloseMessage(request);
            case CANCEL -> buildCancelMessage(request);
            case COMPLETED -> buildCompletedMessage(request);
            case WORK -> buildWorkMessage(request);
            default -> throw new IllegalArgumentException("Unsupported message type");
        };
    }

    public String buildRequestMessage(SGI sgi, MessageType type) {
        return switch (type) {
            case CREATE -> buildCreateMessage(sgi);
            case WORK -> buildWorkMessage(sgi);
            case UPDATE -> buildUpdateMessage(sgi);
            case CLOSE -> buildCloseMessage(sgi);
            case DELETE -> buildDeleteMessage(sgi);
            case REGULAR -> buildRegularMessage(sgi);
            default -> throw new IllegalArgumentException("Unsupported message type");
        };
    }

    private String buildCreateMessage(Requests request) {
        String reason;
        if (request.getTypeRequest().equals(Requests.Type.otk)) {
            reason = request.getReason_wr() != null ? request.getReason_wr() : "Причина не указана";
        } else {
            reason = request.getReason() != null ? request.getReason().getName() : "Причина не указана";
        }
        return String.format(
                "Создана новая заявка: %d\nОтветственный: %s%s\nЗаказ клиента: %s%s\n%s\nКомментарий: %s\nПричина: %s\nСсылка на заявку: %s",
                request.getRequestNumber(),
                request.getEmployee().getName(),
                request.getMlmNode() != null ? "\nЦех: " + request.getMlmNode().getName() : "",
                request.getCustomerOrder().getName(),
                request.getItem() != null ? "\nТип ТМЦ: " + request.getItem().getName() : "Тип не задан",
                !request.getImages().isEmpty() ? "Прикреплены фото" : "Фото не прикреплены",
                request.getComment() != null ? request.getComment() : "",
                reason,
                baseUrl + "/view/" + request.getRequestNumber());
    }

    private String buildUpdateMessage(Requests request) {
        String reason;
        if (request.getTypeRequest().equals(Requests.Type.otk)) {
            reason = request.getReason_wr() != null ? request.getReason_wr() : "Причина не указана";
        } else {
            reason = request.getReason() != null ? request.getReason().getName() : "Причина не указана";
        }
        return String.format(
                "Заявка обновлена: %d \nОтветственный: %s \n%s\nЗаказ клиента: %s %s\n%s\nКомментарий: %s\nПричина: %s\nСтатус: %s\nСсылка на заявку: %s",
                request.getRequestNumber(),
                request.getEmployee().getName(),
                request.getMlmNode().getName(),
                request.getCustomerOrder().getName(),
                request.getItem() != null ? request.getItem().getName() : "Тип не задан",
                !request.getImages().isEmpty() ? "Прикреплены фото" : "Фото не прикреплены",
                request.getComment() != null ? request.getComment() : "",
                reason,
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
                request.getItem() != null ? "\nТип ТМЦ: " + request.getItem().getName() : "Тип не задан",
                !request.getImages().isEmpty() ? "Прикреплены фото" : "Фото не прикреплены",
                request.getComment() != null ? request.getComment() : "",
                request.getReason() != null ? request.getReason().getName() : "Причина не указана",
                baseUrl + "/view/" + request.getRequestNumber());
    }

    private String buildCloseMessage(Requests request) {
        return String.format("Заявка № %d закрыта\nОписание: %s)", request.getRequestNumber(), request.getDescription());
    }

    private String buildCancelMessage(Requests request) {
        return String.format("Заявка № %d отменена\nОписание: %s)", request.getRequestNumber(), request.getDescription());
    }

    private String buildCompletedMessage(Requests request) {
        return String.format("Заявка №%d Выполнена\nСсылка на заявку \n%s/view/%d\nОписание решения: %s",
                request.getRequestNumber(), baseUrl, request.getRequestNumber(), request.getDescription());
    }

    private String buildWorkMessage(Requests request) {
        return String.format("Заявка №%d взято в работу", request.getRequestNumber());
    }

    private String buildCreateMessage(SGI sgi) {
        return String.format("Новое мероприятие №%d\nМероприятие: %s\nОтветственный: %s\nЖелаемый срок: %s\nСопутствующие действия: %s\nПримечание: %s",
                sgi.getRequestNumber(), sgi.getEvent(), sgi.getEmployee().getName(), formatedDate(sgi.getDesiredDate()), sgi.getActions(), sgi.getNote() != null ? sgi.getNote() : "");
    }

    private String buildWorkMessage(SGI sgi) {
        return String.format("На мероприятие №%d установлена плановая дата - %s", sgi.getRequestNumber(), sgi.getPlanDate());
    }

    private String buildUpdateMessage(SGI sgi) {
        return String.format("Мероприятие №%d обновлено", sgi.getRequestNumber());
    }

    private String buildCloseMessage(SGI sgi) {
        return sgi.getAgreed() ? String.format("Мероприятие №%d закрыто", sgi.getRequestNumber()) : String.format("Мероприятие №%s снова открыто", sgi.getRequestNumber());
    }

    private String buildDeleteMessage(SGI sgi) {
        return String.format("Мероприятие №%d удалено", sgi.getRequestNumber());
    }

    private String buildRegularMessage(SGI sgi) {
        return String.format("Просрочен срок выполнения мероприятий: №%s", AppProperties.getString());
    }
}