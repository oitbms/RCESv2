package com.example.rces.controller.payload;

import com.example.rces.models.SGI;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record SubSGIPayload(UUID id, String number, String color, String workcenter, String event, String actions, String department,
                            String departmentName,
                            String employee, LocalDate desiredDate, LocalDate planDate, String note, String comment,
                            Boolean agree, List<ImagesPayload> imagesSGI,
                            Boolean executions, ExecutionsPayload factExecutionSGI, SubSGIPayload parent ) {

    public SubSGIPayload(SGI sgi) {
        this(
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
                sgi.getComment() != null ? sgi.getComment() : "",
                sgi.getAgreed(),
                sgi.getImages().stream().map(img -> new ImagesPayload(img, sgi.getId())).toList(),
                sgi.getExecution() != null,
                new ExecutionsPayload(sgi.getExecution()),
                sgi.getParentSGI()!=null ? new SubSGIPayload(sgi.getParentSGI()):null
        );
    }
}