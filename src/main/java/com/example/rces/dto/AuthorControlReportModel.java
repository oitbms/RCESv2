package com.example.rces.dto;

import com.example.rces.models.AuthorControl;
import com.example.rces.models.AuthorControlDeviation;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class AuthorControlReportModel {

    private String employee;

    private String customerOrderStrCode;

    private String subDivision;

    private String plan;

    private String siteCode;

    private String now;

    private List<Table> violation = new ArrayList<>();

    public AuthorControlReportModel(AuthorControl authorControl) {
        this.employee = authorControl.getEmployee().getName();
        this.plan = authorControl.getTypeAuthor().getName();
        this.subDivision = authorControl.getSubDivision().getName();
        this.plan = authorControl.getTypeAuthor().getName();
        this.siteCode = authorControl.getSiteCode();
        this.customerOrderStrCode = authorControl.getCustomerOrderStrCode();
        this.now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss"));
        authorControl.getAuthorControlDeviations().forEach(deviation -> {
                this.violation.add(new Table(deviation));
        });
    }

    public AuthorControlReportModel(List<AuthorControlDeviation> deviations) {
        this.subDivision = deviations.stream().map(v -> v.getSubDivision().getName()).collect(Collectors.joining(","));
        deviations.forEach(v -> this.violation.add(new Table(v)));
    }


    public static class Table {

        private String itemName;

        private String inconsistency;

        private String subDivision;

        public Table(AuthorControlDeviation deviation) {
            this.itemName = deviation.getItemName();
            this.inconsistency = deviation.getInconsistency();
            this.subDivision = deviation.getSubDivision().getName();
        }

        public String getItemName() {
            return itemName;
        }

        public void setItemName(String itemName) {
            this.itemName = itemName;
        }

        public String getInconsistency() {
            return inconsistency;
        }

        public void setInconsistency(String inconsistency) {
            this.inconsistency = inconsistency;
        }

        public String getSubDivision() {
            return subDivision;
        }

        public void setSubDivision(String subDivision) {
            this.subDivision = subDivision;
        }
    }

    public String getPlan() {
        return plan;
    }

    public void setPlan(String plan) {
        this.plan = plan;
    }

    public String getSiteCode() {
        return siteCode;
    }

    public void setSiteCode(String siteCode) {
        this.siteCode = siteCode;
    }

    public String getEmployee() {
        return employee;
    }

    public void setEmployee(String employee) {
        this.employee = employee;
    }

    public String getCustomerOrderStrCode() {
        return customerOrderStrCode;
    }

    public void setCustomerOrderStrCode(String customerOrderStrCode) {
        this.customerOrderStrCode = customerOrderStrCode;
    }

    public String getSubDivision() {
        return subDivision;
    }

    public void setSubDivision(String subDivision) {
        this.subDivision = subDivision;
    }

    public List<Table> getViolation() {
        return violation;
    }

    public void setViolation(List<Table> violation) {
        this.violation = violation;
    }

    public String getNow() {
        return now;
    }

    public void setNow(String now) {
        this.now = now;
    }
}
