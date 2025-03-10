package com.example.rces.models;

import lombok.AllArgsConstructor;


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
    }

}
