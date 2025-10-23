package com.example.rces.dto;

public class EmployeeDTO {

    private Long id;
    private String name;
    private SubDivisionDTO subDivision;
    private String role;
    private boolean isActive;
    private Long chatId;

    public EmployeeDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public SubDivisionDTO getSubDivision() {
        return subDivision;
    }

    public void setSubDivision(SubDivisionDTO subDivision) {
        this.subDivision = subDivision;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public Long getChatId() {
        return chatId;
    }

    public void setChatId(Long chatId) {
        this.chatId = chatId;
    }
}
