package com.example.rces.models;

import com.example.rces.models.annotation.DisplayName;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "plan_sgi")
public class SGI implements Cloneable {

    public enum Department {
        mechanic("ОГМ"), builder("ОРС"), protection("ОТиПК"), energy("ОГЭ");

        private final String name;

        Department(String name) {
            this.name = name;
        }

        public String getName() {
            return name;
        }
    }

    public enum ColorSGI {
        NONE, RED, GREEN, YELLOW, GREY
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
    @DisplayName("№ цеха")
    private String workShop;

    @Column(name = "event")
    @DisplayName("Мероприятие")
    private String event;

    @Column(name = "actions", length = 499)
    @DisplayName("Действия")
    private String actions;

    @Column(name = "department")
    @Enumerated(EnumType.STRING)
    @DisplayName("Ответственный отдел")
    private SGI.Department department;

    @ManyToOne(fetch = FetchType.EAGER)
    @DisplayName("Ответственный сотрудник")
    private Employee employee;

    @Column(name = "desired_date")
    @DisplayName("Желаемая дата")
    private LocalDate desiredDate;

    @Column(name = "plan_date")
    @DisplayName("Планируемая дата")
    private LocalDate planDate;

    @OneToMany(mappedBy = "sgi", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @DisplayName("Факт выполнения")
    private List<FactExecutionSGI> executions = new ArrayList<>();

    @Column(name = "color")
    @Enumerated(EnumType.STRING)
    private ColorSGI color;

    @Column(name = "note", length = 1000)
    @DisplayName("Примечание")
    private String note;

    @Column(name = "comment", length = 1000)
    @DisplayName("Комментарий")
    private String comment;

    @OneToMany(mappedBy = "sgim", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @DisplayName("Прикрепленные фото")
    private List<Images> images = new ArrayList<>();

    @Column(name = "agreed")
    @DisplayName("Согласовано")
    private Boolean agreed;

    @OneToMany(mappedBy = "sgi", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<SgiLog> log = new ArrayList<>();

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

    public List<Images> getImages() {
        return images;
    }

    public void setImages(List<Images> images) {
        this.images = images;
    }

    public Boolean getAgreed() {
        return agreed;
    }

    public void setAgreed(Boolean agreed) {
        this.agreed = agreed;
    }

    public List<SgiLog> getLog() {
        return log;
    }

    public void setLog(List<SgiLog> log) {
        this.log = log;
    }

    @Override
    public Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
}
