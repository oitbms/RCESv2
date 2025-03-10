//сущность прикрепляемые изображения к вызову технолога
package com.example.rces.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table (name = "imagetechnologist")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ImageTechnologist {
    @Id
    @GeneratedValue (strategy = GenerationType.UUID)
    @Column (name = "id", nullable = false)
    private UUID id;


}
