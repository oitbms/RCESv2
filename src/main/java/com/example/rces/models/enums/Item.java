package com.example.rces.models.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.databind.JsonNode;

public enum Item {

    Item1("ТМЦ1"),
    Item2("ТМЦ2"),
    Item3("ТМЦ3"),
    Item4("ТМЦ4"),
    Item5("ТМЦ5"),
    Item6("ТМЦ6"),
    Item7("ТМЦ7");

    private final String name;

    Item(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    @JsonCreator
    public static Item fromField(JsonNode node) {
        if (node == null) {
            return null;
        }
        if (node.has("name") && node.get("name").isTextual()) {
            String name = node.get("name").asText();
            for (Item item : Item.values()) {
                if (item.getName().equals(name)) {
                    return item;
                }
            }
        }
        throw new IllegalArgumentException("Неизвестная причина: " + node);
    }
}
