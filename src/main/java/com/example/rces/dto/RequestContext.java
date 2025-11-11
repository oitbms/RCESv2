package com.example.rces.dto;

import com.example.rces.models.Employee;
import com.example.rces.models.Inconsistency;
import com.example.rces.models.Requests;

import java.util.Set;

public class RequestContext {

    private Requests request;
    private String description;
    private String status;
    private Integer qty;
    private Set<Inconsistency> inconsistencies;
    private Employee employee;
    private Boolean noticeNp;
    private Boolean noticeOgt;
    private Boolean noticeOgc;


    public RequestContext(Requests request, String description, String status, Integer qty, Set<Inconsistency> inconsistencies, Employee employee, Boolean noticeNp, Boolean noticeOgt, Boolean noticeOgc) {
        this.request = request;
        this.description = description;
        this.status = status;
        this.qty = qty;
        this.inconsistencies = inconsistencies;
        this.employee = employee;
        this.noticeNp = noticeNp;
        this.noticeOgt = noticeOgt;
        this.noticeOgc = noticeOgc;
    }

    public Requests getRequest() {
        return request;
    }

    public void setRequest(Requests request) {
        this.request = request;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setQty(Integer qty) {
        this.qty = qty;
    }

    public void setInconsistencies(Set<Inconsistency> inconsistencies) {
        this.inconsistencies = inconsistencies;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public String getDescription() {
        return description;
    }

    public String getStatus() {
        return status;
    }

    public Integer getQty() {
        return qty;
    }

    public Set<Inconsistency> getInconsistencies() {
        return inconsistencies;
    }

    public Employee getEmployee() {
        return employee;
    }

    public Boolean getNoticeNp() {
        return noticeNp;
    }

    public void setNoticeNp(Boolean noticeNp) {
        this.noticeNp = noticeNp;
    }

    public Boolean getNoticeOgt() {
        return noticeOgt;
    }

    public void setNoticeOgt(Boolean noticeOgt) {
        this.noticeOgt = noticeOgt;
    }

    public Boolean getNoticeOgc() {
        return noticeOgc;
    }

    public void setNoticeOgc(Boolean noticeOgc) {
        this.noticeOgc = noticeOgc;
    }
}
