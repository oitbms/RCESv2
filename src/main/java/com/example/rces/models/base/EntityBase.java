//Класс с общими полями для всех сущностей(кроме Employee т.к там токен доступа или нет)
package com.example.rces.models.base;

import com.example.rces.models.Images;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@MappedSuperclass
public abstract class EntityBase {

    public enum Appraisal {

        score1(1, "Ужасно"),
        score2(2, "Плохо"),
        score3(3, "Удовлетворительно"),
        score4(4, "Хорошо"),
        score5(5, "Отлично");

        private final int id;
        private final String name;

        Appraisal(int id, String name) {
            this.id = id;
            this.name = name;
        }

        public int getId() {
            return id;
        }

        public String getName() {
            return name;
        }

        public static Appraisal fromString(String field) {
            if (field == null) {
                return null;
            }
            for (Appraisal appraisal : Appraisal.values()) {
                if (appraisal.getId() == (Long.parseLong(field))) {
                    return appraisal;
                }
            }
            throw new IllegalArgumentException("Неизвестная оценка: " + field);
        }
    }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false)
    private UUID id;

    @Column(name = "comment")
    private String comment;

    @Column(name = "request_number", unique = true)
    private Integer requestNumber;

    @Column(
            name = "created_at",
            updatable = false
    )
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createDate;

    @Column(name = "score")
    @Enumerated(EnumType.STRING)
    private Appraisal score;

    public List<Images> saveFiles(MultipartFile[] files) {
        List<Images> images = new ArrayList<>();
        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                Images imageEntity = new Images();
                imageEntity.setFileName(file.getOriginalFilename());
                try {
                    imageEntity.setData(file.getBytes());
                    images.add(imageEntity);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return images;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Integer getRequestNumber() {
        return requestNumber;
    }

    public void setRequestNumber(Integer requestNumber) {
        this.requestNumber = requestNumber;
    }

    public LocalDateTime getCreateDate() {
        return createDate;
    }

    public void setCreateDate(LocalDateTime createDate) {
        this.createDate = createDate;
    }

    public Appraisal getScore() {
        return score;
    }

    public void setScore(Appraisal score) {
        this.score = score;
    }

}
