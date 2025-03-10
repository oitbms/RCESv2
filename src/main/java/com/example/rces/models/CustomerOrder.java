//сущность заказы клиентов
package com.example.rces.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "customerorder",
        uniqueConstraints={
                @UniqueConstraint(name="bk_dm_customerorder_str_code_idx", columnNames = {"str_code"})
        })
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerOrder extends EntityBase {

    @Column(name="str_code")
    private String code; // Номер

}
