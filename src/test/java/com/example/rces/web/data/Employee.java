package com.example.rces.web.data;

public class Employee {

    public static final Employee admin_user = new Employee(
            1L, "Гл.Админ(admin)", SubDivision.empty_subDivision, "ADMIN", true, -1L
    );

    private Long id;

    private String name;

    private SubDivision subDivision;

    private String role;

    private boolean isActive;

    private Long chatId;

    public Employee(Long id, String name, SubDivision subDivision, String role, boolean isActive, Long chatId) {
        this.id = id;
        this.name = name;
        this.subDivision = subDivision;
        this.role = role;
        this.isActive = isActive;
        this.chatId = chatId;
    }

    public Employee() {
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

    public SubDivision getSubDivision() {
        return subDivision;
    }

    public void setSubDivision(SubDivision subDivision) {
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
