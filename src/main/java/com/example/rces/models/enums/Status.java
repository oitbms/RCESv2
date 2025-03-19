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
    public static Status fromField(Object field) {
        if (field==null) {
            return null;
        }
        for (Status status : Status.values()) {
            if (status.getName().equals(field)) {
                return status;
            }
        }
        for (Status status : Status.values()) {
            if (status.getId().equals(field)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Неизвестный статус: " + field);
    }
}
