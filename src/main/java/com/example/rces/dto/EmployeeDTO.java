package com.example.rces.dto;

public class EmployeeDTO {

    private Long id;
    private String name;
    private SubDivisionDTO mlmNode;
    private String role;
    private boolean isActive;
    private Long chatId;

    public EmployeeDTO() {
    }

    public EmployeeDTO(Long id, String name, SubDivisionDTO mlmNode, String role, boolean isActive, Long chatId) {
        this.id = id;
        this.name = name;
        this.mlmNode = mlmNode;
        this.role = role;
        this.isActive = isActive;
        this.chatId = chatId;
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

    public SubDivisionDTO getMlmNode() {
        return mlmNode;
    }

    public void setMlmNode(SubDivisionDTO mlmNode) {
        this.mlmNode = mlmNode;
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
