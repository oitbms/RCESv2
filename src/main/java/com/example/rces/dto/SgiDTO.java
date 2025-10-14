package com.example.rces.dto;

import com.example.rces.payload.SubSGIPayload;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public class SgiDTO {

    private UUID id;
    private String number;
    private String color;
    private String workcenter;
    private String event;
    private String actions;
    private String department;
    private String departmentName;
    private String employee;
    private LocalDate desiredDate;
    private java.time.LocalDate planDate;
    private String note;
    private String comment;
    private List<ImagesDTO> imagesSGI;
    private Boolean agree;
    private List<SubSGIPayload> subSGI;
    private FactExecutionSGIDTO factExecution;
    private SubSGIPayload parent;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getWorkcenter() {
        return workcenter;
    }

    public void setWorkcenter(String workcenter) {
        this.workcenter = workcenter;
    }

    public String getEvent() {
        return event;
    }

    public void setEvent(String event) {
        this.event = event;
    }

    public String getActions() {
        return actions;
    }

    public void setActions(String actions) {
        this.actions = actions;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public String getEmployee() {
        return employee;
    }

    public void setEmployee(String employee) {
        this.employee = employee;
    }

    public LocalDate getDesiredDate() {
        return desiredDate;
    }

    public void setDesiredDate(LocalDate desiredDate) {
        this.desiredDate = desiredDate;
    }

    public LocalDate getPlanDate() {
        return planDate;
    }

    public void setPlanDate(LocalDate planDate) {
        this.planDate = planDate;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public List<ImagesDTO> getImagesSGI() {
        return imagesSGI;
    }

    public void setImagesSGI(List<ImagesDTO> imagesSGI) {
        this.imagesSGI = imagesSGI;
    }

    public Boolean getAgree() {
        return agree;
    }

    public void setAgree(Boolean agree) {
        this.agree = agree;
    }

    public List<SubSGIPayload> getSubSGI() {
        return subSGI;
    }

    public void setSubSGI(List<SubSGIPayload> subSGI) {
        this.subSGI = subSGI;
    }

    public FactExecutionSGIDTO getFactExecution() {
        return factExecution;
    }

    public void setFactExecution(FactExecutionSGIDTO factExecution) {
        this.factExecution = factExecution;
    }

    public SubSGIPayload getParent() {
        return parent;
    }

    public void setParent(SubSGIPayload parent) {
        this.parent = parent;
    }
}
