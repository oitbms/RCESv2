package com.example.rces.dto;

import com.example.rces.models.Inconsistency;

import java.util.Set;
import java.util.UUID;

public class RequestParamsDto {

    private String status;
    private UUID requestId;
    private String description;
    private Integer qtyCompleted;
    private String inconsistencyData;
    private Boolean noticeNp;
    private Boolean noticeOgt;
    private Boolean noticeOgc;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public UUID getRequestId() {
        return requestId;
    }

    public void setRequestId(UUID requestId) {
        this.requestId = requestId;
    }

    public Integer getQtyCompleted() {
        return qtyCompleted;
    }

    public void setQtyCompleted(Integer qtyCompleted) {
        this.qtyCompleted = qtyCompleted;
    }

    public String getInconsistencyData() {
        return inconsistencyData;
    }

    public void setInconsistencyData(String inconsistencyData) {
        this.inconsistencyData = inconsistencyData;
    }
}
