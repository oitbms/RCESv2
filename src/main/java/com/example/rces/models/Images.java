//сущность прикрепляемые изображения к вызову технолога
package com.example.rces.models;

import com.example.rces.models.base.EntityBase;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table (name = "images")
public class Images extends EntityBase {

    @Column(name = "file_name")
    private String fileName;

    @Transient
    private Appraisal score;

    @Lob
    private byte[] data;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "technologist_id")
    private Technologist technologist;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "constructor_id")
    private Constructor constructor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "otk_id")
    private Otk otk;

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public byte[] getData() {
        return data;
    }

    public void setData(byte[] data) {
        this.data = data;
    }

    public Technologist getTechnologist() {
        return technologist;
    }

    public void setTechnologist(Technologist technologist) {
        this.technologist = technologist;
    }

    public Constructor getConstructor() {
        return constructor;
    }

    public void setConstructor(Constructor constructor) {
        this.constructor = constructor;
    }

    public Otk getOtk() {
        return otk;
    }

    public void setOtk(Otk otk) {
        this.otk = otk;
    }
}
