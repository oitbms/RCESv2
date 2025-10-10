package com.example.rces.payload;

import com.example.rces.models.Employee;

public record EmployeePayload(Long id, String name, String mlmNode, String role, Long chatId) {

    public EmployeePayload(Employee employee) {
        this(
                employee.getId(),
                employee.getName(),
                employee.getMlmNode().name(),
                employee.getRole(),
                employee.getChatId()
        );
    }

}
