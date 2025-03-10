//сущность прикрепляемые изображения к вызову отк
package com.example.rces.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "imageotk")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ImageOtk {
    @Id
    @GeneratedValue (strategy = GenerationType.UUID)
    @Column (name = "id", nullable = false)
    private UUID id;


}
