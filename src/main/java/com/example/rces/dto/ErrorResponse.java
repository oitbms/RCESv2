package com.example.rces.dto;

import com.example.rces.models.enums.NotificationType;

import java.time.LocalDateTime;
import java.util.Map;

public class ErrorResponse {

    private int statusError;
    private String message;
    private LocalDateTime timestamp;
    private NotificationType notificationType;
    private Map<String, String> fieldErrors;

    public ErrorResponse(int statusError, String message, NotificationType notificationType) {
        this.statusError = statusError;
        this.message = message;
        this.timestamp = LocalDateTime.now();
        this.notificationType = notificationType;
    }

    public int getStatusError() {
        return statusError;
    }

    public void setStatusError(int statusError) {
        this.statusError = statusError;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public NotificationType getNotificationType() {
        return notificationType;
    }

    public void setNotificationType(NotificationType notificationType) {
        this.notificationType = notificationType;
    }

    public Map<String, String> getFieldErrors() {
        return fieldErrors;
    }

    public void setFieldErrors(Map<String, String> fieldErrors) {
        this.fieldErrors = fieldErrors;
    }
}
