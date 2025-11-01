package com.example.rces.dto;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.context.ApplicationContextException;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

import static com.example.rces.utils.DateUtil.parseLocalDate;

public class SpeCreateDTO {

    private String name;
    private String type;
    private String outNumber;
    private String accuracyClass;
    private String limitMeasurement;
    private EmployeeDTO employee;
    private SubDivisionDTO subDivision;
    private String mark;
    private LocalDate datePreparation;
    private LocalDate dateVerification;
    private String certificateNumber;
    private Integer periodicity;

    public SpeCreateDTO() {
    }

    public SpeCreateDTO(JsonNode data,SpeFgisCreateDTO dto) {
        try {
            JsonNode singleMI = data.path("miInfo").path("singleMI");
            JsonNode vriInfo = data.path("vriInfo");
            JsonNode applicable = vriInfo.path("applicable");

            setName(singleMI.path("mitypeTitle").asText());
            setType(singleMI.path("mitypeType").asText());
            setOutNumber(singleMI.path("mitypeNumber").asText());
            setAccuracyClass(dto.getAccuracyClass());
            setLimitMeasurement(dto.getLimitMeasurement());
            setEmployee(dto.getEmployee());
            setSubDivision(dto.getSubDivision());
            setMark(null);
            setDatePreparation(parseLocalDate(vriInfo.path("vrfDate").asText()).minusMonths(1));
            setDateVerification(parseLocalDate(vriInfo.path("vrfDate").asText()));
            setCertificateNumber(applicable.path("certNum").asText());
            setPeriodicity((int) ChronoUnit.MONTHS.between(dateVerification, parseLocalDate(vriInfo.path("validDate").asText())) + 1);
        } catch (Exception e) {
            throw new ApplicationContextException("Ошибка при создании Spe", e);
        }
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

    public SubDivisionDTO getSubDivision() {
        return subDivision;
    }

    public void setSubDivision(SubDivisionDTO subDivision) {
        this.subDivision = subDivision;
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
}
