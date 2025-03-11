//сущность отк
package com.example.rces.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.UUID;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "otkbid")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Otk extends EntityBase{

}
