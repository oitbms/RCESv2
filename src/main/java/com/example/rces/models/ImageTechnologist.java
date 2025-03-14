//сущность прикрепляемые изображения к вызову технолога
package com.example.rces.models;

import com.example.rces.models.base.EntityBase;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table (name = "imagetechnologist")
@AttributeOverride(name = "comment", column = @Column(name = "transient_score"))
public class ImageTechnologist extends EntityBase {
    @Transient
    private Appraisal score;
}
