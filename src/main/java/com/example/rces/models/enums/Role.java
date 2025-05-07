package com.example.rces.models.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.databind.JsonNode;

public enum Role {
    USER("Пользователь"),
    ADMIN("Администратор"),
    TECHNOLOGIST("ОГТ"),
    OTK("ОТК"),
    CONSTRUCTOR("ОГК"),
    MASTER("Мастер");

    private final String name;

    Role(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    @JsonCreator
    public static Role fromField(JsonNode node) {
        if (node == null) {
            return null;
        }

        if (node.has("name") && node.get("name").isTextual()) {
            String name = node.get("name").asText();
            for (Role role : Role.values()) {
                if (role.getName().equals(name)) {
                    return role;
                }
            }
        } else {
            for (Role role : Role.values()) {
                if (role.name().equals(node.textValue())) {
                    return role;
                }
            }
        }
        throw new IllegalArgumentException("Неизвестная роль: " + node);
    }
}
