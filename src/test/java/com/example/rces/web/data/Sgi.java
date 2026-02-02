package com.example.rces.web.data;

import java.time.LocalDate;

public class Sgi {

    public static final Sgi test_sgi = new Sgi(
            "№ 1", "Тестовое мероприятие", "Тестовое действие", Employee.admin_user,
            LocalDate.now(), "Тестовая заметка"
    );

    private String subDivision;

    private String event;

    private String actions;

    private Employee employee;

    private LocalDate desiredDate;

    private String note;

    public Sgi(String subDivision, String event, String actions, Employee employee, LocalDate desiredDate, String note) {
        this.subDivision = subDivision;
        this.event = event;
        this.actions = actions;
        this.employee = employee;
        this.desiredDate = desiredDate;
        this.note = note;
    }

    public Sgi() {
    }

    public String getSubDivision() {
        return subDivision;
    }

    public void setSubDivision(String subDivision) {
        this.subDivision = subDivision;
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

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public LocalDate getDesiredDate() {
        return desiredDate;
    }

    public void setDesiredDate(LocalDate desiredDate) {
        this.desiredDate = desiredDate;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
