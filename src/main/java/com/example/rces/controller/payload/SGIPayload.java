package com.example.rces.controller.payload;

import com.example.rces.models.SGI;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record SGIPayload(UUID id, String workshop, String event, String actions, String department, String departmentName,
                         String employee, LocalDate desiredDate, LocalDate planDate, String note, Boolean agree,
                         Boolean executions, SGIPayload parent ,List<SGI> subSGI) {

    public SGIPayload(SGI sgi) {
        this (
                sgi.getId(),
                sgi.getWorkShop(),
                sgi.getEvent(),
                sgi.getActions(),
                sgi.getDepartment().getName(),
                sgi.getDepartment().getName(),
                sgi.getEmployee().getName(),
                sgi.getDesiredDate(),
                sgi.getPlanDate(),
                sgi.getNote(),
                sgi.getAgreed(),
                sgi.getExecution()!=null,
                sgi.getParentSGI()!=null?new SGIPayload(sgi.getParentSGI()):null,
                sgi.getSubSGI()
        );
    }
}
