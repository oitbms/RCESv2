package com.example.rces.dto.report;

import com.example.rces.models.SPE;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

public class UnloadSpeReportModel {

    private List<UnloadSpeReportModel.Table> lines = new ArrayList<>();

    public UnloadSpeReportModel(List<SPE> speList) {
        for (SPE spe : speList) {
            UnloadSpeReportModel.Table table = new UnloadSpeReportModel.Table();
            table.setName(spe.getName());
            table.setType(spe.getType());
            table.setOutNumber(spe.getOutNumber());
            table.setAccuracyClass(spe.getAccuracyClass());
            table.setLimitMeasurement(spe.getLimitMeasurement());
            table.setSubDivision(spe.getSubDivision().getName());
            table.setEmployee(spe.getEmployee().getName());
            table.setMark(spe.getMark());
            table.setDatePreparation(Timestamp.valueOf(spe.getDatePreparation().atStartOfDay()));
            table.setDateVerification(Timestamp.valueOf(spe.getDateVerification().atStartOfDay()));
            table.setCertificateNumber(spe.getCertificateNumber());
            table.setPeriodicity(spe.getPeriodicity());
            table.setStatus(spe.getStatus().getDescription());
            this.lines.add(table);
        }
    }


    public List<Table> getLines() {
        return lines;
    }

    public void setLines(List<Table> lines) {
        this.lines = lines;
    }

    public static class Table {

        private String name;

        private String type;

        private String outNumber;

        private String accuracyClass;

        private String limitMeasurement;

        private String subDivision;

        private String employee;

        private String mark;

        private Timestamp datePreparation;

        private Timestamp dateVerification;

        private String certificateNumber;

        private Integer periodicity;

        private String status;

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

        public String getSubDivision() {
            return subDivision;
        }

        public void setSubDivision(String subDivision) {
            this.subDivision = subDivision;
        }

        public String getEmployee() {
            return employee;
        }

        public void setEmployee(String employee) {
            this.employee = employee;
        }

        public String getMark() {
            return mark;
        }

        public void setMark(String mark) {
            this.mark = mark;
        }

        public Timestamp getDatePreparation() {
            return datePreparation;
        }

        public void setDatePreparation(Timestamp datePreparation) {
            this.datePreparation = datePreparation;
        }

        public Timestamp getDateVerification() {
            return dateVerification;
        }

        public void setDateVerification(Timestamp dateVerification) {
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

        public void setStatus(String status) {
            this.status = status;
        }
    }

}
