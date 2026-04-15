package com.example.rces.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class PartsDirectoryDTO {

    private Long id;

    private Long version;

    private CustomerOrderDTO customerOrder;

    private EmployeeDTO employee;

    private String name;

    private String scheme;

    private String thickness;

    private String steel;

    private Integer qty;

    private Integer qtyCompleted;

    private String measurements;

    private String program;

    private String machine;

    private String status;

    private String comment;

    private String color;

    private LocalDate dateCompletion;

    private Boolean ready;

    private TeamDTO team;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }

    public CustomerOrderDTO getCustomerOrder() {
        return customerOrder;
    }

    public void setCustomerOrder(CustomerOrderDTO customerOrder) {
        this.customerOrder = customerOrder;
    }

    public EmployeeDTO getEmployee() {
        return employee;
    }

    public void setEmployee(EmployeeDTO employee) {
        this.employee = employee;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getScheme() {
        return scheme;
    }

    public void setScheme(String scheme) {
        this.scheme = scheme;
    }

    public String getThickness() {
        return thickness;
    }

    public void setThickness(String thickness) {
        this.thickness = thickness;
    }

    public String getSteel() {
        return steel;
    }

    public void setSteel(String steel) {
        this.steel = steel;
    }

    public Integer getQty() {
        return qty;
    }

    public void setQty(Integer qty) {
        this.qty = qty;
    }

    public Integer getQtyCompleted() {
        return qtyCompleted;
    }

    public void setQtyCompleted(Integer qtyCompleted) {
        this.qtyCompleted = qtyCompleted;
    }

    public String getMeasurements() {
        return measurements;
    }

    public void setMeasurements(String measurements) {
        this.measurements = measurements;
    }

    public String getProgram() {
        return program;
    }

    public void setProgram(String program) {
        this.program = program;
    }

    public String getMachine() {
        return machine;
    }

    public void setMachine(String machine) {
        this.machine = machine;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public LocalDate getDateCompletion() {
        return dateCompletion;
    }

    public void setDateCompletion(LocalDate dateCompletion) {
        this.dateCompletion = dateCompletion;
    }

    public Boolean getReady() {
        return ready;
    }

    public void setReady(Boolean ready) {
        this.ready = ready;
    }

    public TeamDTO getTeam() {
        return team;
    }

    public void setTeam(TeamDTO team) {
        this.team = team;
    }
}
