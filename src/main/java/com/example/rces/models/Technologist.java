//сущность технолога
package com.example.rces.models;

import com.example.rces.models.enums.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "technologistbid")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Technologist extends EntityBase {

    @ManyToOne(fetch = FetchType.LAZY)
    private Employee employee;

    @Column(name = "reason")
    @Enumerated(EnumType.STRING)
    private GeneralReason.Technologist reason;

    @ManyToOne(fetch = FetchType.LAZY)
    private CustomerOrder customerOrder;

    @Column(name = "request_number")
    private Integer requestNumber;

    @Column(name = "status_id")
    @Enumerated(EnumType.STRING)
    private Status status;

    @ManyToOne(fetch = FetchType.LAZY)
    private ImageTechnologist image;

}
