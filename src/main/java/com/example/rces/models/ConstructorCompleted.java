package com.example.rces.models;

import com.example.rces.models.base.EntityBase;
import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "constructorcompleted")
public class ConstructorCompleted extends EntityBase {

    private String name;
    private Date date;
    private String status;
    private String employ;
    private String description;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getEmploy() {
        return employ;
    }

    public void setEmploy(String employ) {
        this.employ = employ;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
