package com.example.rces.models.enums;

public enum StatusAuthor {

    NEW("Новый"),
    PENDING_APPROVAL("На согласовании"),
    AWAITING_FIX("Ожидает устранения"),
    NOT_APPROVED("Не согласовано"),
    APPROVED("Согласовано"),
    CANCELLED("Аннулирован");

    private final String name;

    StatusAuthor(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

}
