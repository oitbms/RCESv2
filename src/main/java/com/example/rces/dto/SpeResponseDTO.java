package com.example.rces.dto;

import com.example.rces.models.enums.StatusSPE;

import java.util.List;

public class SpeResponseDTO {

    private List<SpeDTO> speDTOList;

    private int totalCount;

    private int writeOff;

    private int verificationRequired;

    private int expired;

    private int atInspection;

    public SpeResponseDTO (List<SpeDTO> speDTOList) {
        this.speDTOList = speDTOList;
        this.totalCount = speDTOList.size();
        this.writeOff = (int) speDTOList.stream().filter(s -> s.getStatus().equals(StatusSPE.WRITE_OFF)).count();
        this.verificationRequired = (int) speDTOList.stream().filter(s -> s.getStatus().equals(StatusSPE.VERIFICATION_REQUIRED)).count();
        this.expired = (int) speDTOList.stream().filter(s -> s.getStatus().equals(StatusSPE.EXPIRED)).count();
        this.atInspection = (int) speDTOList.stream().filter(s -> s.getStatus().equals(StatusSPE.AT_INSPECTION)).count();
    }

    public List<SpeDTO> getSpeDTOList() {
        return speDTOList;
    }

    public void setSpeDTOList(List<SpeDTO> speDTOList) {
        this.speDTOList = speDTOList;
    }

    public int getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(int totalCount) {
        this.totalCount = totalCount;
    }

    public int getWriteOff() {
        return writeOff;
    }

    public void setWriteOff(int writeOff) {
        this.writeOff = writeOff;
    }

    public int getVerificationRequired() {
        return verificationRequired;
    }

    public void setVerificationRequired(int verificationRequired) {
        this.verificationRequired = verificationRequired;
    }

    public int getExpired() {
        return expired;
    }

    public void setExpired(int expired) {
        this.expired = expired;
    }

    public int getAtInspection() {
        return atInspection;
    }

    public void setAtInspection(int atInspection) {
        this.atInspection = atInspection;
    }
}
