//Все статусы
package com.example.rces.models.enums;

import lombok.Getter;

@Getter
public enum Status {

    NEW(1L, "Новый"),
    WORK(2L, "В работе"),
    CLOCED(3L, "Закрыт"),
    CANCELED(4L, "Отменен");

    private final Long id;
    private final String name;

    Status(Long id, String name) {
        this.id = id;
        this.name = name;
    }

}
