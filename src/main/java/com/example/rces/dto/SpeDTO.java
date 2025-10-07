package com.example.rces.dto;

import com.example.rces.models.enums.Color;
import com.example.rces.models.enums.StatusSPE;

import java.time.Instant;
import java.time.LocalDate;

public class SpeDTO {

    private Integer number;
    private Long version;
    private String name;
    private String type;
    private String outNumber;
    private String accuracyClass;
    private String subDivision;
    private String limitMeasurement;
    private EmployeeDTO employee;
    private String mark;
    private LocalDate datePreparation;
    private LocalDate dateVerification;
    private String certificateNumber;
    private Integer periodicity;
    private String status;
    private Color color;
    private Instant created;
    private Instant updated;

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

    public EmployeeDTO getEmployee() {
        return employee;
    }

    public void setEmployee(EmployeeDTO employee) {
        this.employee = employee;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(StatusSPE status) {
        this.status = status.getDescription();
    }

    public Color getColor() {
        return color;
    }

    public void setColor(Color color) {
        this.color = color;
    }

    public Instant getCreated() {
        return created;
    }

    public void setCreated(Instant created) {
        this.created = created;
    }

    public Instant getUpdated() {
        return updated;
    }

    public void setUpdated(Instant updated) {
        this.updated = updated;
    }

    public String getMark() {
        return mark;
    }

    public void setMark(String mark) {
        this.mark = mark;
    }

    public String getSubDivision() {
        return subDivision;
    }

    public void setSubDivision(String subDivision) {
        this.subDivision = subDivision;
    }

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }
}
