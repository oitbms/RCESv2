package com.example.rces.controller.payload;

import com.example.rces.models.SGI;

import java.time.LocalDate;
import java.util.UUID;

public record SubSGIPayload(UUID id, String number, String workcenter, String event, String actions, String department,
                            String departmentName,
                            String employee, LocalDate desiredDate, LocalDate planDate, String note, String comment,
                            Boolean agree,
                            Boolean executions) {

    public SubSGIPayload(SGI sgi) {
        this(
                sgi.getId(),
                String.valueOf(sgi.getRequestNumber()),
                sgi.getWorkShop(),
                sgi.getEvent(),
                sgi.getActions(),
                String.valueOf(sgi.getDepartment()),
                sgi.getDepartment().getName(),
                sgi.getEmployee().getName(),
                sgi.getDesiredDate(),
                sgi.getPlanDate(),
                sgi.getNote(),
                sgi.getComment() != null ? sgi.getComment() : "",
                sgi.getAgreed(),
                sgi.getExecution() != null
        );
    }
}