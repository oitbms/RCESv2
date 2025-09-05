package com.example.rces.controller.payload;

import com.example.rces.models.CustomerOrder;

import java.time.LocalDateTime;
import java.util.UUID;

public record CustomerOrderPayload(UUID id, String name, LocalDateTime createDate, String employeeName) {

    public CustomerOrderPayload(CustomerOrder customerOrder) {
        this(
        customerOrder.getId(),
        customerOrder.getName(),
        customerOrder.getCreateDate(),
        customerOrder.getEmployee() != null ? customerOrder.getEmployee().getName() : null
        );
    }
}
