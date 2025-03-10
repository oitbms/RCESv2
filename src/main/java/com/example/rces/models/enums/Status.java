//Все статусы
package com.example.rces.models.enums;

public enum Status {

    New(1L, "Новый"),
    InWork(2L, "В работе"),
    Closed(3L, "Закрыт"),
    Cancel(4L, "Отменен");

    private final Long id;
    private final String name;

    Status(Long id, String name) {
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
