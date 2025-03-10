//сущность прикрепляемые изображения к вызову конструктора
package com.example.rces.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.UUID;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "imageconstructor")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ImageConstructor extends EntityBase{

}
