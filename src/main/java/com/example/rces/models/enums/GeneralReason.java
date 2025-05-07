//Класс с причинами вызовов
package com.example.rces.models.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.databind.JsonNode;

public enum GeneralReason {

    tech1("Первая причина", "technologist"),
    tech2("Вторая причина", "technologist"),
    cons1("Первая причина", "constructor"),
    cons2("Вторая причина", "constructor"),
    otk1("ВИК", "otk"),
    otk2("УДС", "otk"),
    otk3("УЗД", "otk");

    private final String name;

    private final String requestType;

    GeneralReason(String name, String requestType) {
        this.name = name;
        this.requestType = requestType;
    }

    public String getName() {
        return name;
    }

    public String getRequestType() {
        return requestType;
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
