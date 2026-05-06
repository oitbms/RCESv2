package com.example.rces.dto;

import java.math.BigDecimal;

public class PartsDirectoryCreateDTOFrom1C {

    private String customerOrder;

    private String scheme;

    private String name;

    private Integer qty;

    private String steel;

    private String measurements;

    public String getCustomerOrder() {
        return customerOrder;
    }

    public void setCustomerOrder(String customerOrder) {
        this.customerOrder = customerOrder;
    }

    public String getScheme() {
        return scheme;
    }

    public void setScheme(String scheme) {
        this.scheme = scheme;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getQty() {
        return qty;
    }

    public void setQty(Integer qty) {
        this.qty = qty;
    }

    public String getSteel() {
        return steel;
    }

    public void setSteel(String steel) {
        this.steel = steel;
    }

    public String getMeasurements() {
        return measurements;
    }

    public void setMeasurements(String measurements) {
        this.measurements = measurements;
    }
}
