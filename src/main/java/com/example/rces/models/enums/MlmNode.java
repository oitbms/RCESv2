//Все цеха
package com.example.rces.models.enums;

import lombok.Getter;

@Getter
public enum MlmNode {

    workShop1(1L, "Цех 1"),
    workShop2(2L, "Цех 1"),
    workShop3(3L, "Цех 1"),
    workShop4(4L, "Цех 1"),
    workShop5(5L, "Цех 5"),
    workShop6(6L, "Цех 6"),
    workShop7(7L, "Цех 7");

    private final Long id;
    private final String name;

    MlmNode(Long id, String name) {
        this.id = id;
        this.name = name;
    }

}
