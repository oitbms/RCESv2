package com.example.rces.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class MachineDto {

    private String name;
    private String description;
    private Integer number;
    private Long subDivisionId;
    private String subDivisionName;
    private UUID passportId;
    private String otherText;
    private List<DocumentFileDTO> otherPdfs = new ArrayList<>();
    private List<EmployeeDTO> admittedEmployeesList = new ArrayList<>();
    private List<EmployeeDTO> responsibleEmployeesList = new ArrayList<>();
    private List<ImagesDTO> imageUrls = new ArrayList<>();
    private List<DocumentFileDTO> pdfs = new ArrayList<>();

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getNumber() {
        return number;
    }

    public void setNumber(Integer number) {
        this.number = number;
    }

    public List<EmployeeDTO> getAdmittedEmployeesList() {
        return admittedEmployeesList;
    }

    public void setAdmittedEmployeesList(List<EmployeeDTO> admittedEmployeesList) {
        this.admittedEmployeesList = admittedEmployeesList;
    }

    public List<EmployeeDTO> getResponsibleEmployeesList() {
        return responsibleEmployeesList;
    }

    public void setResponsibleEmployeesList(List<EmployeeDTO> responsibleEmployeesList) {
        this.responsibleEmployeesList = responsibleEmployeesList;
    }

    public List<ImagesDTO> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<ImagesDTO> imageUrls) {
        this.imageUrls = imageUrls;
    }

    public List<DocumentFileDTO> getPdfs() {
        return pdfs;
    }

    public void setPdfs(List<DocumentFileDTO> pdfs) {
        this.pdfs = pdfs;
    }

    public Long getSubDivisionId() {
        return subDivisionId;
    }

    public void setSubDivisionId(Long subDivisionId) {
        this.subDivisionId = subDivisionId;
    }

    public String getSubDivisionName() {
        return subDivisionName;
    }

    public void setSubDivisionName(String subDivisionName) {
        this.subDivisionName = subDivisionName;
    }

    public UUID getPassportId() {
        return passportId;
    }

    public void setPassportId(UUID passportId) {
        this.passportId = passportId;
    }

    public String getOtherText() {
        return otherText;
    }

    public void setOtherText(String otherText) {
        this.otherText = otherText;
    }

    public List<DocumentFileDTO> getOtherPdfs() {
        return otherPdfs;
    }

    public void setOtherPdfs(List<DocumentFileDTO> otherPdfs) {
        this.otherPdfs = otherPdfs;
    }
}
