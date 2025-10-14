package com.example.rces.dto;

import java.util.List;
import java.util.UUID;

public class FactExecutionSGIDTO {

    private UUID id;
    private String executionDate;
    private String report;
    private List<ImagesDTO> imagesFactSGI;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getExecutionDate() {
        return executionDate;
    }

    public void setExecutionDate(String executionDate) {
        this.executionDate = executionDate;
    }

    public String getReport() {
        return report;
    }

    public void setReport(String report) {
        this.report = report;
    }

    public List<ImagesDTO> getImagesFactSGI() {
        return imagesFactSGI;
    }

    public void setImagesFactSGI(List<ImagesDTO> imagesFactSGI) {
        this.imagesFactSGI = imagesFactSGI;
    }
}
