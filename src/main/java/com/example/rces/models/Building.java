package com.example.rces.models;

import jakarta.persistence.*;

@Entity
@Table(name = "building")
public class Building extends BaseAuditingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subdivision_id", nullable = false)
    private SubDivision subdivision;

    @Column(name = "name", nullable = false)
    private String name;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "document_id", referencedColumnName = "id")
    private Document document;

    @Column(name = "other_text", columnDefinition = "TEXT")
    private String otherText;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "other_document_id", referencedColumnName = "id")
    private Document otherDocument;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SubDivision getSubdivision() {
        return subdivision;
    }

    public void setSubdivision(SubDivision subdivision) {
        this.subdivision = subdivision;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Document getDocument() {
        return document;
    }

    public void setDocument(Document document) {
        this.document = document;
    }

    public String getOtherText() {
        return otherText;
    }

    public void setOtherText(String otherText) {
        this.otherText = otherText;
    }

    public Document getOtherDocument() {
        return otherDocument;
    }

    public void setOtherDocument(Document otherDocument) {
        this.otherDocument = otherDocument;
    }
}
