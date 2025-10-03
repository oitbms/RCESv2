package com.example.rces.models.enums;

public enum StatusSPE {

    NONE("ОК"),
    WRITE_OFF("Списан"),
    VERIFICATION_REQUIRED("Требуется поверка"),
    EXPIRED("Истек срок поверки"),
    AT_INSPECTION("На поверке");

    private String description;

    StatusSPE(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
