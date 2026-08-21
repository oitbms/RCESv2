package com.example.rces.dto;

import java.time.LocalDateTime;

public class SpmCreateDTO {

    private String customerOrderLine;
    private String customerOrderName;
    private LocalDateTime dateStart;
    private Integer priority;

    public String getCustomerOrderLine() {
        return customerOrderLine;
    }

    public void setCustomerOrderLine(String customerOrderLine) {
        this.customerOrderLine = customerOrderLine;
    }

    public String getCustomerOrderName() {
        return customerOrderName;
    }

    public void setCustomerOrderName(String customerOrderName) {
        this.customerOrderName = customerOrderName;
    }

    public LocalDateTime getDateStart() {
        return dateStart;
    }

    public void setDateStart(LocalDateTime dateStart) {
        this.dateStart = dateStart;
    }

    public Integer getPriority() {
        return priority;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }
}
