package com.example.rces.models.enums;

public enum TypeAuthor {

    PLANNED("Плановый"),
    UNPLANNED("Внеплановый");

    private final String name;

    TypeAuthor(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

}
