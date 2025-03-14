//сущность технолога
package com.example.rces.models;

import com.example.rces.models.base.EntityBase;
import com.example.rces.models.enums.Status;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "technologistbid")
public class Technologist extends EntityBase {

    @ManyToOne(fetch = FetchType.LAZY)
    private Employee employee;

    @Column(name = "reason")
    @Enumerated(EnumType.STRING)
    private GeneralReason.Technologist reason;

    @ManyToOne(fetch = FetchType.LAZY)
    private CustomerOrder customerOrder;

    @Column(name = "status_id")
    @Enumerated(EnumType.STRING)
    private Status status;

    @ManyToOne(fetch = FetchType.LAZY)
    private ImageTechnologist image;

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public GeneralReason.Technologist getReason() {
        return reason;
    }

    public void setReason(GeneralReason.Technologist reason) {
        this.reason = reason;
    }

    public CustomerOrder getCustomerOrder() {
        return customerOrder;
    }

    public void setCustomerOrder(CustomerOrder customerOrder) {
        this.customerOrder = customerOrder;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public ImageTechnologist getImage() {
        return image;
    }

    public void setImage(ImageTechnologist image) {
        this.image = image;
    }
}
