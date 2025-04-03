package com.example.rces.models.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.databind.JsonNode;

public enum Inconsistency {

    Inconsistency1("Несоответствие1"),
    Inconsistency2("Несоответствие2"),
    Inconsistency3("Несоответствие3"),
    Inconsistency4("Несоответствие4"),
    Inconsistency5("Несоответствие5"),
    Inconsistency6("Несоответствие6"),
    Inconsistency7("Несоответствие7");

    private final String name;

    Inconsistency(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    @JsonCreator
    public static Inconsistency fromField(JsonNode node) {
        if (node == null) {
            return null;
        }
        if (node.has("name") && node.get("name").isTextual()) {
            String name = node.get("name").asText();
            for (Inconsistency inconsistency : Inconsistency.values()) {
                if (inconsistency.getName().equals(name)) {
                    return inconsistency;
                }
            }
        }
        throw new IllegalArgumentException("Неизвестное несоответствие: " + node);
    }

}
