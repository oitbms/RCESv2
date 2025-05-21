package com.example.rces.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "plan_sgi")
public class SGI {

    public enum Department {
        mechanic("ОГМ"), builder("ОРС");

        private final String name;

        Department(String name) {
            this.name = name;
        }
        public String getName() {
            return name;
        }
    }

    public enum ColorSGI {
        NONE,RED,GREEN,YELLOW,GREY
    }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false)
    private UUID id;

    @Column(name = "created_at")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDate createDate;

    @Column(name = "number")
    private int requestNumber;

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
    private LocalDate desiredDate;

    @Column(name = "plan_date")
    private LocalDate planDate;

    @OneToMany(mappedBy = "sgi", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FactExecutionSGI> executions = new ArrayList<>();

    @Column(name = "color")
    @Enumerated(EnumType.STRING)
    private ColorSGI color;

    @Column(name = "comment")
    private String comment;

    @Column(name = "agreed")
    private Boolean agreed;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public LocalDate getCreateDate() {
        return createDate;
    }

    public void setCreateDate(LocalDate createDate) {
        this.createDate = createDate;
    }

    public int getRequestNumber() {
        return requestNumber;
    }

    public void setRequestNumber(int requestNumber) {
        this.requestNumber = requestNumber;
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

    public List<FactExecutionSGI> getExecutions() {
        return executions;
    }

    public void setExecutions(List<FactExecutionSGI> executions) {
        this.executions = executions;
    }

    public ColorSGI getColor() {
        return color;
    }

    public void setColor(ColorSGI color) {
        this.color = color;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Boolean getAgreed() {
        return agreed;
    }

    public void setAgreed(Boolean agreed) {
        this.agreed = agreed;
    }
}
