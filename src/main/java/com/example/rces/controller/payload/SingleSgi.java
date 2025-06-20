package com.example.rces.controller.payload;

import java.time.LocalDate;
import java.util.UUID;

public record SingleSgi(UUID id, String workshop, String event, String actions, String department, String departmentName,
                        String employee, LocalDate desiredDate, LocalDate planDate, String note, Boolean agree,
                        Boolean executions) {
}
