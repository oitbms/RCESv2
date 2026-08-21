package com.example.rces.dto;

import java.time.LocalDate;

public class PartsDirectoryCreateDTOFromSpm {

    private String customerOrderLine;

    private LocalDate dateStart;

    private Integer priority;

    public String getCustomerOrderLine() {
        return customerOrderLine;
    }

    public void setCustomerOrderLine(String customerOrderLine) {
        this.customerOrderLine = customerOrderLine;
    }

    public LocalDate getDateStart() {
        return dateStart;
    }

    public void setDateStart(LocalDate dateStart) {
        this.dateStart = dateStart;
    }

    public Integer getPriority() {
        return priority;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }
}
