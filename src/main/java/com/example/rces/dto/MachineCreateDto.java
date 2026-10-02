package com.example.rces.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

public class MachineCreateDto {

    @NotBlank(message = "Заполните наименование")
    private String name;

    @NotBlank(message = "Заполните описание")
    private String description;

    @NotNull(message = "Заполните инвентарный номер")
    private Integer number;

    @NotNull(message = "Заполните местонахождение")
    private Long subDivisionId;

    private MultipartFile[] documentFiles;

    private MultipartFile[] additionalFiles;

    private MultipartFile[] passportFiles;

    private List<String> admittedEmployeesList = new ArrayList<>();

    private List<String> responsibleEmployeesList = new ArrayList<>();

    public @NotBlank(message = "Наименование станка не должно быть пустым!") String getName() {
        return name;
    }

    public void setName(@NotBlank(message = "Наименование станка не должно быть пустым!") String name) {
        this.name = name;
    }

    public @NotBlank(message = "Описание не должно быть пустым!") String getDescription() {
        return description;
    }

    public void setDescription(@NotBlank(message = "Описание не должно быть пустым!") String description) {
        this.description = description;
    }

    public Integer getNumber() {
        return number;
    }

    public void setNumber(Integer number) {
        this.number = number;
    }

    public MultipartFile[] getDocumentFiles() {
        return documentFiles;
    }

    public void setDocumentFiles(MultipartFile[] documentFiles) {
        this.documentFiles = documentFiles;
    }

    public List<String> getAdmittedEmployeesList() {
        return admittedEmployeesList;
    }

    public void setAdmittedEmployeesList(List<String> admittedEmployeesList) {
        this.admittedEmployeesList = admittedEmployeesList;
    }

    public List<String> getResponsibleEmployeesList() {
        return responsibleEmployeesList;
    }

    public void setResponsibleEmployeesList(List<String> responsibleEmployeesList) {
        this.responsibleEmployeesList = responsibleEmployeesList;
    }

    public MultipartFile[] getAdditionalFiles() {
        return additionalFiles;
    }

    public void setAdditionalFiles(MultipartFile[] additionalFiles) {
        this.additionalFiles = additionalFiles;
    }

    public Long getSubDivisionId() {
        return subDivisionId;
    }

    public void setSubDivisionId(Long subDivisionId) {
        this.subDivisionId = subDivisionId;
    }

    public MultipartFile[] getPassportFiles() {
        return passportFiles;
    }

    public void setPassportFiles(MultipartFile[] passportFiles) {
        this.passportFiles = passportFiles;
    }
}
