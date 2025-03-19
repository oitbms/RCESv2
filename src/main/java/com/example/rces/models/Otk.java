//сущность отк
package com.example.rces.models;

import com.example.rces.models.base.EntityBase;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "otkbid")
public class Otk extends EntityBase {

    @OneToMany(mappedBy = "otk", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Images> image;

    public List<Images> getImage() {
        return image;
    }

    public void setImage(List<Images> image) {
        this.image = image;
    }
}
