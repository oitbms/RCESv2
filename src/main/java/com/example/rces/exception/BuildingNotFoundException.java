package com.example.rces.exception;

import com.example.rces.models.enums.NotificationType;

public class BuildingNotFoundException extends RuntimeException {
    public BuildingNotFoundException(Long id, NotificationType type) {
        super("Здание с id " + id + " не найдено");
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
