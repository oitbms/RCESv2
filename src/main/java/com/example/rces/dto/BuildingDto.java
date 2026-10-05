package com.example.rces.dto;

import java.util.ArrayList;
import java.util.List;

public class BuildingDto {

    private Long id;
    private int itemNumber;
    private Long subDivisionId;
    private String subDivisionName;
    private String otherText;
    private List<DocumentFileDTO> otherPdfs = new ArrayList<>();
    private List<ImagesDTO> imageUrls = new ArrayList<>();
    private List<DocumentFileDTO> pdfs = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getItemNumber() {
        return itemNumber;
    }

    public void setItemNumber(int itemNumber) {
        this.itemNumber = itemNumber;
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
