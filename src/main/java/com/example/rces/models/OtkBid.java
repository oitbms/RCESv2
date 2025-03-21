//сущность отк
package com.example.rces.models;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "otkbid")
public class OtkBid {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false)
    private UUID id; // Уникальный дентификатор
    @Column(name = "datetime")
    private Instant datetime; //Дата и время
    @Column(name = "numorder")
    private int numorder; //Номер заказа
    @Column(name = "naimdetail")
    private String naimdetail; //Название детали
    @Column(name = "description", columnDefinition = "text")
    private String description; //Примечание, описание
    @Column(name = "quantity")
    private int quantity; //Количество
    @Column(name = "workshop")
    private String workshop; //Цех, участок
    @Column(name = "workshopchief")
    private String workshopchief;//ФИО руководителя подразделения
    @Column(name = "purpose")
    private String purpose; //Цель, причина вызова
    @Column(name = "qaworker")
    private String qaworker; //ФИО контролёра
    @Column(name = "bidstatus")
    private String bidstatus; //Статус заявки

    public OtkBid() {
    }

    public OtkBid(int i, long l, int numorder, String решетка, String правая, int quantity, String workshop, String головачёв, String вик, String дорохов, String новый) {
    }

    public OtkBid(UUID id, Instant datetime, int numorder, String naimdetail, String description, int quantity, String workshop, String workshopchief, String purpose, String qaworker, String bidstatus) {
        this.id = id;
        this.datetime = datetime;
        this.numorder = numorder;
        this.naimdetail = naimdetail;
        this.description = description;
        this.quantity = quantity;
        this.workshop = workshop;
        this.workshopchief = workshopchief;
        this.purpose = purpose;
        this.qaworker = qaworker;
        this.bidstatus = bidstatus;
    }

    protected boolean canEqual(final Object other) {
        return other instanceof OtkBid;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public void setDatetime(Instant datetime) {
        this.datetime = datetime;
    }

    public void setNumorder(int numorder) {
        this.numorder = numorder;
    }

    public void setNaimdetail(String naimdetail) {
        this.naimdetail = naimdetail;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public void setWorkshop(String workshop) {
        this.workshop = workshop;
    }

    public void setWorkshopchief(String workshopchief) {
        this.workshopchief = workshopchief;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public void setQaworker(String qaworker) {
        this.qaworker = qaworker;
    }

    public void setBidstatus(String bidstatus) {
        this.bidstatus = bidstatus;
    }

    public boolean equals(final Object o) {
        if (o == this) return true;
        if (!(o instanceof OtkBid)) return false;
        final OtkBid other = (OtkBid) o;
        if (!other.canEqual((Object) this)) return false;
        final Object this$id = this.getId();
        final Object other$id = other.getId();
        if (this$id == null ? other$id != null : !this$id.equals(other$id)) return false;
        final Object this$datetime = this.getDatetime();
        final Object other$datetime = other.getDatetime();
        if (this$datetime == null ? other$datetime != null : !this$datetime.equals(other$datetime)) return false;
        if (this.getNumorder() != other.getNumorder()) return false;
        final Object this$naimdetail = this.getNaimdetail();
        final Object other$naimdetail = other.getNaimdetail();
        if (this$naimdetail == null ? other$naimdetail != null : !this$naimdetail.equals(other$naimdetail))
            return false;
        final Object this$description = this.getDescription();
        final Object other$description = other.getDescription();
        if (this$description == null ? other$description != null : !this$description.equals(other$description))
            return false;
        if (this.getQuantity() != other.getQuantity()) return false;
        final Object this$workshop = this.getWorkshop();
        final Object other$workshop = other.getWorkshop();
        if (this$workshop == null ? other$workshop != null : !this$workshop.equals(other$workshop)) return false;
        final Object this$workshopchief = this.getWorkshopchief();
        final Object other$workshopchief = other.getWorkshopchief();
        if (this$workshopchief == null ? other$workshopchief != null : !this$workshopchief.equals(other$workshopchief))
            return false;
        final Object this$purpose = this.getPurpose();
        final Object other$purpose = other.getPurpose();
        if (this$purpose == null ? other$purpose != null : !this$purpose.equals(other$purpose)) return false;
        final Object this$qaworker = this.getQaworker();
        final Object other$qaworker = other.getQaworker();
        if (this$qaworker == null ? other$qaworker != null : !this$qaworker.equals(other$qaworker)) return false;
        final Object this$bidstatus = this.getBidstatus();
        final Object other$bidstatus = other.getBidstatus();
        if (this$bidstatus == null ? other$bidstatus != null : !this$bidstatus.equals(other$bidstatus)) return false;
        return true;
    }

    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final Object $id = this.getId();
        result = result * PRIME + ($id == null ? 43 : $id.hashCode());
        final Object $datetime = this.getDatetime();
        result = result * PRIME + ($datetime == null ? 43 : $datetime.hashCode());
        result = result * PRIME + this.getNumorder();
        final Object $naimdetail = this.getNaimdetail();
        result = result * PRIME + ($naimdetail == null ? 43 : $naimdetail.hashCode());
        final Object $description = this.getDescription();
        result = result * PRIME + ($description == null ? 43 : $description.hashCode());
        result = result * PRIME + this.getQuantity();
        final Object $workshop = this.getWorkshop();
        result = result * PRIME + ($workshop == null ? 43 : $workshop.hashCode());
        final Object $workshopchief = this.getWorkshopchief();
        result = result * PRIME + ($workshopchief == null ? 43 : $workshopchief.hashCode());
        final Object $purpose = this.getPurpose();
        result = result * PRIME + ($purpose == null ? 43 : $purpose.hashCode());
        final Object $qaworker = this.getQaworker();
        result = result * PRIME + ($qaworker == null ? 43 : $qaworker.hashCode());
        final Object $bidstatus = this.getBidstatus();
        result = result * PRIME + ($bidstatus == null ? 43 : $bidstatus.hashCode());
        return result;
    }

    public String toString() {
        return "Otk(id=" + this.getId() + ", datetime=" + this.getDatetime() + ", numorder=" + this.getNumorder() + ", naimdetail=" + this.getNaimdetail() + ", description=" + this.getDescription() + ", quantity=" + this.getQuantity() + ", workshop=" + this.getWorkshop() + ", workshopchief=" + this.getWorkshopchief() + ", purpose=" + this.getPurpose() + ", qaworker=" + this.getQaworker() + ", bidstatus=" + this.getBidstatus() + ")";
    }

    public UUID getId() {
        return this.id;
    }

    public Instant getDatetime() {
        return this.datetime;
    }

    public int getNumorder() {
        return this.numorder;
    }

    public String getNaimdetail() {
        return this.naimdetail;
    }

    public String getDescription() {
        return this.description;
    }

    public int getQuantity() {
        return this.quantity;
    }

    public String getWorkshop() {
        return this.workshop;
    }

    public String getWorkshopchief() {
        return this.workshopchief;
    }

    public String getPurpose() {
        return this.purpose;
    }

    public String getQaworker() {
        return this.qaworker;
    }

    public String getBidstatus() {
        return this.bidstatus;
    }
}
