//Все цеха
package com.example.rces.models.enums;


import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.databind.JsonNode;

public enum MlmNode {

    workShop1("Цех №1"),
    workShop2("Цех №3"),
    workShop3("Цех №4"),
    workShop4("Цех №5"),
    workShop5("Цех №6"),
    workShop6("Цех №7"),
    workShop7("Цех №8"),
    mechanic("ОГМ"),
    builder("ОРС"),
    protection("ОТиПК"),
    energy("ОГЭ");

    private final String name;

    MlmNode(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    @JsonCreator
    public static MlmNode fromField(JsonNode node) {
        if (node == null) {
            return null;
        }

        if (node.has("name") && node.get("name").isTextual()) {
            String name = node.get("name").asText();
            for (MlmNode mlmNode : MlmNode.values()) {
                if (mlmNode.getName().equals(name)) {
                    return mlmNode;
                }
            }
        } else {
            for (MlmNode mlmNode : MlmNode.values()) {
                if (mlmNode.name().equals(node.textValue())) {
                    return mlmNode;
                }
            }
        }

        throw new IllegalArgumentException("Неизвестный цех: " + node);
    }

}
