//Класс с причинами вызовов
package com.example.rces.models;

import com.example.rces.models.enums.Status;

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

        public static Technologist fromField(Object field) {
            if (field==null) {
                return null;
            }
            for (Technologist technologist : Technologist.values()) {
                if (technologist.getName().equals(field)) {
                    return technologist;
                }
            }
            for (Technologist technologist : Technologist.values()) {
                if (technologist.getId().equals(field)) {
                    return technologist;
                }
            }
            throw new IllegalArgumentException("Неизвестная причина: " + field);
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
        public static Otk fromField(Object field) {
            if (field==null) {
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
        public static Constructor fromField(Object field) {
            if (field==null) {
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
