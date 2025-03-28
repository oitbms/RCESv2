//сущность прикрепляемые изображения к вызову технолога
package com.example.rces.models;

import com.example.rces.models.base.EntityBase;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;

import java.lang.reflect.Method;
import java.time.LocalDateTime;
import java.util.Base64;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "images")
public class Images extends EntityBase {

    @Column(name = "file_name")
    private String fileName;

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

    @Column(name = "request_number", insertable = false, updatable = false)
    private Integer requestNumber;

    @Column(name = "score", insertable = false, updatable = false)
    @Enumerated(EnumType.STRING)
    private Appraisal score;


    public Images() {
    }

    public Images(String base64, String className, Object entity) {
        setBase64Data(base64);
        setFileName("Фото от " + LocalDateTime.now());
        try {
            Class<?> paramClass = Class.forName("com.example.rces.models." + className);
            Method method = this.getClass().getMethod("set" + className, paramClass);
            method.invoke(this, paramClass.cast(entity));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

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

    @Override
    public Integer getRequestNumber() {
        return requestNumber;
    }

    @Override
    public void setRequestNumber(Integer requestNumber) {
        this.requestNumber = requestNumber;
    }

    @Override
    public Appraisal getScore() {
        return score;
    }

    @Override
    public void setScore(Appraisal score) {
        this.score = score;
    }

    public String getBase64Data() {
        return data != null ? "data:image/png;base64," + Base64.getEncoder().encodeToString(data) : "";
    }

    public void setBase64Data(String base64Image) {
        setData(Base64.getDecoder().decode(base64Image.substring("data:image/jpeg;base64,".length())));
    }

}
