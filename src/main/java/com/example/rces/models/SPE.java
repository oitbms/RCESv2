package com.example.rces.models;

import com.example.rces.models.enums.Color;
import com.example.rces.models.enums.StatusSPE;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import org.hibernate.envers.Audited;
import org.hibernate.envers.RelationTargetAuditMode;

import java.time.LocalDate;

@Entity
@Table(name = "plan_spe")
@Audited(targetAuditMode = RelationTargetAuditMode.NOT_AUDITED)
public class SPE extends BaseAuditingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "number")
    private Integer number;

    @Column(name = "name")
    private String name;

    @Column(name = "type")
    private String type;

    @Column(name = "out_number")
    private String outNumber;

    @Column(name = "accuracy_class")
    private String accuracyClass;

    @Column(name = "limit_measurement")
    private String limitMeasurement;

    @ManyToOne(fetch = FetchType.LAZY)
    private Employee employee;

    @Column(name = "mark")
    private String mark;

    @Column(name = "date_preparation")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate datePreparation;

    @Column(name = "date_verification")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateVerification;

    @Column(name = "certificate_number")
    private String certificateNumber;

    @Column(name = "periodicity")
    private Integer periodicity;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private StatusSPE status;

    @Column(name = "color")
    @Enumerated(EnumType.STRING)
    private Color color;

    public Integer getNumber() {
        return number;
    }

    public void setNumber(Integer number) {
        this.number = number;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getOutNumber() {
        return outNumber;
    }

    public void setOutNumber(String outNumber) {
        this.outNumber = outNumber;
    }

    public String getAccuracyClass() {
        return accuracyClass;
    }

    public void setAccuracyClass(String accuracyClass) {
        this.accuracyClass = accuracyClass;
    }

    public String getLimitMeasurement() {
        return limitMeasurement;
    }

    public void setLimitMeasurement(String limitMeasurement) {
        this.limitMeasurement = limitMeasurement;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public String getMark() {
        return mark;
    }

    public void setMark(String mark) {
        this.mark = mark;
    }

    public LocalDate getDatePreparation() {
        return datePreparation;
    }

    public void setDatePreparation(LocalDate datePreparation) {
        this.datePreparation = datePreparation;
    }

    public LocalDate getDateVerification() {
        return dateVerification;
    }

    public void setDateVerification(LocalDate dateVerification) {
        this.dateVerification = dateVerification;
    }

    public String getCertificateNumber() {
        return certificateNumber;
    }

    public void setCertificateNumber(String certificateNumber) {
        this.certificateNumber = certificateNumber;
    }

    public Integer getPeriodicity() {
        return periodicity;
    }

    public void setPeriodicity(Integer periodicity) {
        this.periodicity = periodicity;
    }

    public StatusSPE getStatus() {
        return status;
    }

    public void setStatus(StatusSPE status) {
        this.status = status;
    }

    public Color getColor() {
        return color;
    }

    public void setColor(Color color) {
        this.color = color;
    }
}
