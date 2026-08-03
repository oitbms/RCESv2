package com.example.rces.models;

import com.example.rces.models.enums.StatusAuthor;
import com.example.rces.models.enums.TypeAuthor;
import jakarta.persistence.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "author_control", catalog = "rces")
@EntityListeners(AuditingEntityListener.class)
public class AuthorControl extends BaseAuditingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "site_id", nullable = false)
    private Site site;

    @Column(name = "inconsistency", nullable = false)
    private Boolean inconsistency;

    @Column(name = "str_code", nullable = false)
    private String customerOrderStrCode;

    @Column(name = "site_code")
    private String siteCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subdivision_id", nullable = false)
    private SubDivision subDivision;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_author", nullable = false)
    private StatusAuthor statusAuthor;

    @Enumerated(EnumType.STRING)
    @Column(name = "type_author", nullable = false)
    private TypeAuthor typeAuthor;

    @OneToMany(mappedBy = "authorControl", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AuthorControlDeviation> authorControlDeviations = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Site getSite() {
        return site;
    }

    public void setSite(Site site) {
        this.site = site;
    }

    public Boolean getInconsistency() {
        return inconsistency;
    }

    public void setInconsistency(Boolean inconsistency) {
        this.inconsistency = inconsistency;
    }

    public String getCustomerOrderStrCode() {
        return customerOrderStrCode;
    }

    public void setCustomerOrderStrCode(String customerOrderStrCode) {
        this.customerOrderStrCode = customerOrderStrCode;
    }

    public String getSiteCode() {
        return siteCode;
    }

    public void setSiteCode(String siteCode) {
        this.siteCode = siteCode;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public SubDivision getSubDivision() {
        return subDivision;
    }

    public void setSubDivision(SubDivision subDivision) {
        this.subDivision = subDivision;
    }

    public StatusAuthor getStatusAuthor() {
        return statusAuthor;
    }

    public void setStatusAuthor(StatusAuthor statusAuthor) {
        this.statusAuthor = statusAuthor;
    }

    public TypeAuthor getTypeAuthor() {
        return typeAuthor;
    }

    public void setTypeAuthor(TypeAuthor typeAuthor) {
        this.typeAuthor = typeAuthor;
    }

    public List<AuthorControlDeviation> getAuthorControlDeviations() {
        return authorControlDeviations;
    }

    public void setAuthorControlDeviations(List<AuthorControlDeviation> authorControlDeviations) {
        this.authorControlDeviations = authorControlDeviations;
    }
}
