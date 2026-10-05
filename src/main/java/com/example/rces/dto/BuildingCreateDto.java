package com.example.rces.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.web.multipart.MultipartFile;

public class BuildingCreateDto {

    @NotNull(message = "Подразделение должно быть указано")
    private Long subDivisionId;

    @NotBlank(message = "Укажите полное название здания")
    @Size(max = 255, message = "Название не должно превышать 255 символов")
    private String name;

    private MultipartFile[] documentFiles;

    private MultipartFile[] additionalFiles;

    public Long getSubDivisionId() {
        return subDivisionId;
    }

    public void setSubDivisionId(Long subDivisionId) {
        this.subDivisionId = subDivisionId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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
