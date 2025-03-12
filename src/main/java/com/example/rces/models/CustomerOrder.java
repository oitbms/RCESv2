//сущность заказы клиентов
package com.example.rces.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "customerorder")
public class CustomerOrder extends EntityBase {

    @Column(name = "str_code")
    private String name; // Номер заказа

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
