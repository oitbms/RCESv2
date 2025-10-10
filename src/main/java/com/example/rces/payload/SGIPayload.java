package com.example.rces.payload;

import com.example.rces.models.SGI;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record SGIPayload(UUID id, String number, String color, String workcenter, String event, String actions, String department, String departmentName,
                         String employee, LocalDate desiredDate, LocalDate planDate, String note,
                         String comment, List<ImagesPayload> imagesSGI, Boolean agree,
                         List<SubSGIPayload> subSGI, FactExecutionPayload factExecutionSGI, SubSGIPayload parent) {

    public SGIPayload(SGI sgi) {
        this (
                sgi.getId(),
                String.valueOf(sgi.getRequestNumber()),
                sgi.getColor().name(),
                sgi.getWorkShop(),
                sgi.getEvent(),
                sgi.getActions(),
                String.valueOf(sgi.getDepartment()),
                sgi.getDepartment().getName(),
                sgi.getEmployee().getName(),
                sgi.getDesiredDate(),
                sgi.getPlanDate(),
                sgi.getNote(),
                sgi.getComment()!=null ? sgi.getComment() : "",
                null,
                sgi.getAgreed(),
                sgi.getSubSGI().stream().map(SubSGIPayload::new).toList(),
                sgi.getExecution()!=null ? new FactExecutionPayload(sgi.getExecution()) : null,
                sgi.getParentSGI()!=null ? new SubSGIPayload(sgi.getParentSGI()):null
        );
    }
}
