//Все статусы
package com.example.rces.models.enums;

public enum Status {

    New(1L, "Новый"),
    InWork(2L, "В работе"),
    Cloced(3L, "Закрыт"),
    Canceled(4L, "Отменен");

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
    public static Status fromString(String statusName) {
        for (Status status : Status.values()) {
            if (status.getName().equals(statusName)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Неизвестный статус: " + statusName);
    }
}
