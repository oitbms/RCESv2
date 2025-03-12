//Класс с причинами вызовов
package com.example.rces.models;

import lombok.Getter;

public class GeneralReason {

    @Getter
    public enum Technologist {
        TECH1(1L, "Первая причина"),
        TECH2(2L, "Вторая причина");

        private final Long id;
        private final String name;

        Technologist(Long id, String name) {
            this.id = id;
            this.name = name;
        }

    }

    @Getter
    public enum Otk {
        OTK1(1L, "Первая причина"),
        OTK2(2L, "Вторая причина");

        private final Long id;
        private final String name;

        Otk(Long id, String name) {
            this.id = id;
            this.name = name;
        }

    }

    @Getter
    public enum Constructor {
        CONSTR1(1L, "Первая причина"),
        CONSTR2(2L, "Вторая причина");

        private final Long id;
        private final String name;

        Constructor(Long id, String name) {
            this.id = id;
            this.name = name;
        }

    }

}
