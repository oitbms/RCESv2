package com.example.rces.models;

import lombok.AllArgsConstructor;


public class GeneralReason {

    @AllArgsConstructor
    public enum Technologist {
        TECH1(1L, "Первая причина"),
        TECH2(2L, "Вторая причина");

        private final Long id;
        private final String name;
    }

    @AllArgsConstructor
    public enum Otk {
        OTK1(1L, "Первая причина"),
        OTK2(2L, "Вторая причина");

        private final Long id;
        private final String name;
    }

    @AllArgsConstructor
    public enum Constructor {
        CONSTR1(1L, "Первая причина"),
        CONSTR2(2L, "Вторая причина");

        private final Long id;
        private final String name;
    }

}
