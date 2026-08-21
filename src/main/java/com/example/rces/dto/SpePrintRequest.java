package com.example.rces.dto;

import java.util.List;

public class SpePrintRequest {

    private String format;
    private List<Integer> idList;

    public SpePrintRequest() {
    }

    public SpePrintRequest(String format, List<Integer> idList) {
        this.format = format;
        this.idList = idList;
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }

    public List<Integer> getIdList() {
        return idList;
    }

    public void setIdList(List<Integer> idList) {
        this.idList = idList;
    }
}
