package com.example.rces.models;

import com.example.rces.models.enums.Color;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "spm", catalog = "rces")
public class Spm extends BaseAuditingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_order_line")
    private String customerOrderLine;

    @Column(name = "date_start")
    private LocalDate dateStart;

    @Column(name = "priority")
    private Integer priority;

    @Column(name = "color")
    @Enumerated(EnumType.STRING)
    private Color color;

    public Spm() {
    }

    public Spm(String customerOrderLine, LocalDate dateStart, Integer priority) {
        this.customerOrderLine = customerOrderLine;
        this.dateStart = dateStart;
        this.priority = priority;
        this.color = Color.NONE;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCustomerOrderLine() {
        return customerOrderLine;
    }

    public void setCustomerOrderLine(String customerOrderLine) {
        this.customerOrderLine = customerOrderLine;
    }

    public LocalDate getDateStart() {
        return dateStart;
    }

    public void setDateStart(LocalDate dateStart) {
        this.dateStart = dateStart;
    }

    public Integer getPriority() {
        return priority;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }

    public Color getColor() {
        return color;
    }

    public void setColor(Color color) {
        this.color = color;
    }
}
