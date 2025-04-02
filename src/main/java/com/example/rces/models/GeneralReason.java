//Класс с причинами вызовов
package com.example.rces.models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.databind.JsonNode;

public enum GeneralReason {

    one("Первая причина"),
    two("Вторая причина");

    private final String name;

    GeneralReason(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    @JsonCreator
    public static GeneralReason fromField(JsonNode node) {
        if (node == null) {
            return null;
        }

        if (node.has("name") && node.get("name").isTextual()) {
            String name = node.get("name").asText();
            for (GeneralReason reason : GeneralReason.values()) {
                if (reason.getName().equals(name)) {
                    return reason;
                }
            }
        }

        throw new IllegalArgumentException("Неизвестная причина: " + node);
    }
}
