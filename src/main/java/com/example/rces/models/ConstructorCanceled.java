package com.example.rces.models;

import com.example.rces.models.base.EntityBase;
import jakarta.persistence.*;

@Entity
@Table(name = "constructorcanceled")
public class ConstructorCanceled extends EntityBase {

    private String name;
    private String description;
    private String canceledDescription;
    private String employ;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCanceledDescription() {
        return canceledDescription;
    }

    public void setCanceledDescription(String canceledDescription) {
        this.canceledDescription = canceledDescription;
    }

    public String getEmploy() {
        return employ;
    }

    public void setEmploy(String employ) {
        this.employ = employ;
    }
}
