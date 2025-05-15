package com.example.rces.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "plan_sgi")
public class SGI {

    public enum Department {
        constructor, otk, technologist
    }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false)
    private UUID id;

    @Column(name = "number")
    private int number;

    @Column(name = "workshop")
    private String workShop;

    @Column(name = "event")
    private String event;

    @Column(name = "actions")
    private String actions;

    @Column(name = "department")
    @Enumerated(EnumType.STRING)
    private SGI.Department department;

    @ManyToOne(fetch = FetchType.EAGER)
    private Employee employee;

    @Column(name = "desired_date")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime desiredDate;

    @Column(name = "plan_date")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime planDate;

    @OneToMany(mappedBy = "sgi", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FactExecutionSGI> executions = new ArrayList<>();

    @Column(name = "comment")
    private String comment;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }

    public String getWorkShop() {
        return workShop;
    }

    public void setWorkShop(String workShop) {
        this.workShop = workShop;
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

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public LocalDateTime getDesiredDate() {
        return desiredDate;
    }

    public void setDesiredDate(LocalDateTime desiredDate) {
        this.desiredDate = desiredDate;
    }

    public LocalDateTime getPlanDate() {
        return planDate;
    }

    public void setPlanDate(LocalDateTime planDate) {
        this.planDate = planDate;
    }

    public List<FactExecutionSGI> getExecutions() {
        return executions;
    }

    public void setExecutions(List<FactExecutionSGI> executions) {
        this.executions = executions;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
