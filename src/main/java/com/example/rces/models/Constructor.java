//сущность конструктора
package com.example.rces.models;

import com.example.rces.models.base.EntityBase;
import com.example.rces.models.enums.Status;
import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "constructorbid")
public class Constructor extends EntityBase {

    private String name;
    private String description;
    private String numberWorkshop;
    private String customerOrder;
//    private String image;
    private boolean accepted;
    private Date dateStartAccepted;
    private Date dateEndAccepted;
    @Enumerated(EnumType.STRING) // Сохраняем значение enum как строку
    private Status status;

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

    public String getNumberWorkshop() {
        return numberWorkshop;
    }

    public void setNumberWorkshop(String numberWorkshop) {
        this.numberWorkshop = numberWorkshop;
    }

    public String getCustomerOrder() {
        return customerOrder;
    }

    public void setCustomerOrder(String customerOrder) {
        this.customerOrder = customerOrder;
    }

    public boolean isAccepted() {
        return accepted;
    }

    public void setAccepted(boolean accepted) {
        this.accepted = accepted;
    }

    public Date getDateStartAccepted() {
        return dateStartAccepted;
    }

    public void setDateStartAccepted(Date dateStartAccepted) {
        this.dateStartAccepted = dateStartAccepted;
    }

    public Date getDateEndAccepted() {
        return dateEndAccepted;
    }

    public void setDateEndAccepted(Date dateEndAccepted) {
        this.dateEndAccepted = dateEndAccepted;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
}
