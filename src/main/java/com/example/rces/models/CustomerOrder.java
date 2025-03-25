//сущность заказы клиентов
package com.example.rces.models;

import com.example.rces.models.base.EntityBase;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "customerorder")
@AttributeOverride(name = "requestNumber", column = @Column(name = "transient_requestNumber"))
@AttributeOverride(name = "score", column = @Column(name = "transient_score"))
public class CustomerOrder extends EntityBase {

    @Column(name = "str_code")
    private String name; // Номер заказа

    @Transient
    private Integer requestNumber;

    @Transient
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
