package com.example.rces.models;


import jakarta.persistence.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Отклонение в авторском контроле
 */
@Entity
@Table(name = "authorcontrol_deviation", catalog = "rces")
@EntityListeners(AuditingEntityListener.class)
public class AuthorControlDeviation extends BaseAuditingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "item_name", nullable = false, length = 512)
    private String itemName;

    @Column(name = "inconsistency", nullable = false, length = 512)
    private String inconsistency;

    @Column(name = "comment", length = 512)
    private String description;

    @Column(name = "number")
    private int deviationNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subdivision_id", nullable = false)
    private SubDivision subDivision;

    @Column(name = "period_removal", nullable = false)
    private LocalDate periodRemoval;

    @Column(name = "date_removal", nullable = false)
    private LocalDate dateRemoval;

    @OneToMany(mappedBy = "authorControlDeviation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Images> images = new ArrayList<>();

    @OneToMany(mappedBy = "authorControlDeviationCorrection", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Images> imagesCorrections = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_control_id", nullable = false)
    private AuthorControl authorControl;

    @Column(name = "success", nullable = false)
    private Boolean success;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public String getInconsistency() {
        return inconsistency;
    }

    public void setInconsistency(String inconsistency) {
        this.inconsistency = inconsistency;
    }

    public SubDivision getSubDivision() {
        return subDivision;
    }

    public void setSubDivision(SubDivision subDivision) {
        this.subDivision = subDivision;
    }

    public LocalDate getPeriodRemoval() {
        return periodRemoval;
    }

    public void setPeriodRemoval(LocalDate periodRemoval) {
        this.periodRemoval = periodRemoval;
    }

    public LocalDate getDateRemoval() {
        return dateRemoval;
    }

    public void setDateRemoval(LocalDate dateRemoval) {
        this.dateRemoval = dateRemoval;
    }

    public List<Images> getImages() {
        return images;
    }

    public void setImages(List<Images> images) {
        this.images = images;
    }

    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }

    public AuthorControl getAuthorControl() {
        return authorControl;
    }

    public void setAuthorControl(AuthorControl authorControl) {
        this.authorControl = authorControl;
    }

    public List<Images> getImagesCorrections() {
        return imagesCorrections;
    }

    public void setImagesCorrections(List<Images> imagesCorrections) {
        this.imagesCorrections = imagesCorrections;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getDeviationNumber() {
        return deviationNumber;
    }

    public void setDeviationNumber(int deviationNumber) {
        this.deviationNumber = deviationNumber;
    }
}
