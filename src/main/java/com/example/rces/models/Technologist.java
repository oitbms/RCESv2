//сущность технолога
package com.example.rces.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "technologistbid")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Technologist extends EntityBase {

    @ManyToOne(fetch=FetchType.LAZY)
    private Employee employee;

    @Column(name = "reason")
    @Enumerated(EnumType.STRING)
    private GeneralReason.Technologist reason;

    @ManyToOne(fetch = FetchType.LAZY)
    private CustomerOrder customerOrder;

}
