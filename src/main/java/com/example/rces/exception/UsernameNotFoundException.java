package com.example.rces.exception;

import com.example.rces.models.enums.NotificationType;

public class UsernameNotFoundException extends RuntimeException {
    public UsernameNotFoundException(String message, NotificationType type) {
        super(message);
        this.notificationType = type;
    }

    private NotificationType notificationType;

    public NotificationType getNotificationType() {
        return notificationType;
    }

    public void setNotificationType(NotificationType notificationType) {
        this.notificationType = notificationType;
    }
}
