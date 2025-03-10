package com.example.rces.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@MappedSuperclass
@Data
@AllArgsConstructor
@NoArgsConstructor
public abstract class EntityBase {

    public enum Appraisal {

        score1(1, "Ужасно"),
        score2(2, "Плохо"),
        score3(3, "Удовлетворительно"),
        score4(4, "Хорошо"),
        score5(5, "Отлично");

        private final int id;
        private final String score;

        Appraisal(int id, String score) {
            this.id = id;
            this.score = score;
        }

        public int getId() {
            return id;
        }

        public String getScore() {
            return score;
        }
    }

    @Id
    @GeneratedValue (strategy = GenerationType.UUID)
    @Column (name = "id", nullable = false)
    private UUID id;

    @Column(name = "comment")
    private String comment;

    @Column(
            name = "created_at",
            updatable = false
    )
    private LocalDateTime createDate;

    @Column(name = "score")
    @Enumerated(EnumType.STRING)
    private Appraisal score;

}
