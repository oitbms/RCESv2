//сущность заказы клиентов
package com.example.rces.models;

import com.example.rces.models.base.EntityBase;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "customerorder")
public class CustomerOrder extends EntityBase {

    @Column(name = "str_code")
    private String name; // Номер заказа

    @Column(name = "request_number", insertable = false, updatable = false)
    private Integer requestNumber;

    @Column(name = "score", insertable = false, updatable = false)
    @Enumerated(EnumType.STRING)
    private Appraisal score;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public Integer getRequestNumber() {
        return requestNumber;
    }

    @Override
    public void setRequestNumber(Integer requestNumber) {
        this.requestNumber = requestNumber;
    }

    @Override
    public Appraisal getScore() {
        return score;
    }

    @Override
    public void setScore(Appraisal score) {
        this.score = score;
    }
}
