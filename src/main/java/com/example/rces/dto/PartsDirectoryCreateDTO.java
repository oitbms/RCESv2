package com.example.rces.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class PartsDirectoryCreateDTO {

    private String customerOrder;

    private String name;

    private String thickness;

    private String steel;

    private String measurements;

    private String scheme;

    @NotNull
    @Min(0)
    private Integer qty;

    @Min(0)
    private Integer qtyCompleted;

    private String comment;

    private String machine;

    private String program;

    private EmployeeDTO employee;

    private LocalDateTime dateCompletion;

    private TeamDTO team;

    public String getCustomerOrder() {
        return customerOrder;
    }

    public void setCustomerOrder(String customerOrder) {
        this.customerOrder = customerOrder;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public String getMeasurements() {
        return measurements;
    }

    public void setMeasurements(String measurements) {
        this.measurements = measurements;
    }

    public String getScheme() {
        return scheme;
    }

    public void setScheme(String scheme) {
        this.scheme = scheme;
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

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getMachine() {
        return machine;
    }

    public void setMachine(String machine) {
        this.machine = machine;
    }

    public String getProgram() {
        return program;
    }

    public void setProgram(String program) {
        this.program = program;
    }

    public EmployeeDTO getEmployee() {
        return employee;
    }

    public void setEmployee(EmployeeDTO employee) {
        this.employee = employee;
    }

    public LocalDateTime getDateCompletion() {
        return dateCompletion;
    }

    public void setDateCompletion(LocalDateTime dateCompletion) {
        this.dateCompletion = dateCompletion;
    }

    public TeamDTO getTeam() {
        return team;
    }

    public void setTeam(TeamDTO team) {
        this.team = team;
    }
}
