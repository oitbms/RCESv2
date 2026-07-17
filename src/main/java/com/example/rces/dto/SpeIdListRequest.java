package com.example.rces.dto;

import java.util.List;

public class SpeIdListRequest {

    private List<Integer> idList;

    public SpeIdListRequest() {
    }

    public SpeIdListRequest(List<Integer> idList) {
        this.idList = idList;
    }

    public List<Integer> getIdList() {
        return idList;
    }

    public void setIdList(List<Integer> idList) {
        this.idList = idList;
    }
}
