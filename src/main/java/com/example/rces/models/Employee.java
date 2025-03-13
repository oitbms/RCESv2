//сущность сотрудники
package com.example.rces.models;

import com.example.rces.models.enums.MlmNode;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "employees")
public class Employee {

    @Id
    private Long id;

    private String name;

    @Enumerated(EnumType.STRING)
    private MlmNode mlmNode;

    private String role;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public MlmNode getMlmNode() {
        return mlmNode;
    }

    public void setMlmNode(MlmNode mlmNode) {
        this.mlmNode = mlmNode;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
