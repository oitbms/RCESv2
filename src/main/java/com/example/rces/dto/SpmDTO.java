package com.example.rces.dto;

import java.time.LocalDate;

public class SpmDTO {

    private Long id;
    private Long version;
    private String customerOrderLine;
    private CustomerOrderDTO customerOrder;
    private Boolean loaded;
    private LocalDate dateStart;
    private Integer priority;
    private String color;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }

    public String getCustomerOrderLine() {
        return customerOrderLine;
    }

    public void setCustomerOrderLine(String customerOrderLine) {
        this.customerOrderLine = customerOrderLine;
    }

    public CustomerOrderDTO getCustomerOrder() {
        return customerOrder;
    }

    public void setCustomerOrder(CustomerOrderDTO customerOrder) {
        this.customerOrder = customerOrder;
    }

    public Boolean getLoaded() {
        return loaded;
    }

    public void setLoaded(Boolean loaded) {
        this.loaded = loaded;
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

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
