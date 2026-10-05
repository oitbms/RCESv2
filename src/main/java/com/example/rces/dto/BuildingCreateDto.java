package com.example.rces.dto;

import jakarta.validation.constraints.NotNull;
import org.springframework.web.multipart.MultipartFile;

public class BuildingCreateDto {

    @NotNull(message = "Подразделение должно быть указано")
    private Long subDivisionId;

    @NotNull(message = "Инвентарный номер должен быть указан")
    private Integer itemNumber;

    private MultipartFile[] documentFiles;

    private MultipartFile[] additionalFiles;

    public Long getSubDivisionId() {
        return subDivisionId;
    }

    public void setSubDivisionId(Long subDivisionId) {
        this.subDivisionId = subDivisionId;
    }

    public Integer getItemNumber() {
        return itemNumber;
    }

    public void setItemNumber(Integer itemNumber) {
        this.itemNumber = itemNumber;
    }

    public MultipartFile[] getDocumentFiles() {
        return documentFiles;
    }

    public void setDocumentFiles(MultipartFile[] documentFiles) {
        this.documentFiles = documentFiles;
    }

    public MultipartFile[] getAdditionalFiles() {
        return additionalFiles;
    }

    public void setAdditionalFiles(MultipartFile[] additionalFiles) {
        this.additionalFiles = additionalFiles;
    }
}
