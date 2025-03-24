//Класс с причинами вызовов
package com.example.rces.models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import com.fasterxml.jackson.databind.JsonNode;

public class GeneralReason {

    public enum Technologist {
        TECH1(1L, "Первая причина"),
        TECH2(2L, "Вторая причина");

        private final Long id;
        private final String name;

        Technologist(Long id, String name) {
            this.id = id;
            this.name = name;
        }

        public Long getId() {
            return id;
        }

        public String getName() {
            return name;
        }

        @JsonValue
        public Long toValue() {
            return this.id;
        }

        @JsonCreator
        public static Technologist fromField(JsonNode node) {
            if (node == null) {
                return null;
            }

            // Если node — это объект, извлекаем id или name
            if (node.isObject()) {
                Long id = node.has("id") ? node.get("id").asLong() : null;
                String name = node.has("name") ? node.get("name").asText() : null;

                if (id != null) {
                    for (Technologist technologist : Technologist.values()) {
                        if (technologist.getId().equals(id)) {
                            return technologist;
                        }
                    }
                }

                if (name != null) {
                    for (Technologist technologist : Technologist.values()) {
                        if (technologist.getName().equals(name)) {
                            return technologist;
                        }
                    }
                }
            }
            if (node.isNumber()) {
                Long id = node.asLong();
                for (Technologist technologist : Technologist.values()) {
                    if (technologist.getId().equals(id)) {
                        return technologist;
                    }
                }
            }
            if (node.isTextual()) {
                String name = node.asText();
                for (Technologist technologist : Technologist.values()) {
                    if (technologist.getName().equals(name)) {
                        return technologist;
                    }
                }
            }

            throw new IllegalArgumentException("Неизвестная причина: " + node);
        }
    }


    public enum Otk {
        OTK1(1L, "Первая причина"),
        OTK2(2L, "Вторая причина");

        private final Long id;
        private final String name;

        Otk(Long id, String name) {
            this.id = id;
            this.name = name;
        }

        public Long getId() {
            return id;
        }

        public String getName() {
            return name;
        }

        @JsonValue
        public Long toValue() {
            return this.id;
        }

        @JsonCreator
        public static Otk fromField(Object field) {
            if (field == null) {
                return null;
            }
            for (Otk otk : Otk.values()) {
                if (otk.getName().equals(field)) {
                    return otk;
                }
            }
            for (Otk otk : Otk.values()) {
                if (otk.getId().equals(field)) {
                    return otk;
                }
            }
            throw new IllegalArgumentException("Неизвестная причина: " + field);
        }
    }

    public enum Constructor {
        CONSTR1(1L, "Первая причина"),
        CONSTR2(2L, "Вторая причина");

        private final Long id;
        private final String name;

        Constructor(Long id, String name) {
            this.id = id;
            this.name = name;
        }

        public Long getId() {
            return id;
        }

        public String getName() {
            return name;
        }

        @JsonValue
        public Long toValue() {
            return this.id;
        }

        @JsonCreator
        public static Constructor fromField(Object field) {
            if (field == null) {
                return null;
            }
            for (Constructor constructor : Constructor.values()) {
                if (constructor.getName().equals(field)) {
                    return constructor;
                }
            }
            for (Constructor constructor : Constructor.values()) {
                if (constructor.getId().equals(field)) {
                    return constructor;
                }
            }
            throw new IllegalArgumentException("Неизвестная причина: " + field);
        }
    }

}
