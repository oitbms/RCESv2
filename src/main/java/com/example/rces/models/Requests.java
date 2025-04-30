package com.example.rces.models;

import com.example.rces.models.enums.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Entity
public class Requests implements Cloneable {

    public enum Type {
        constructor, otk, technologist
    }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false)
    private UUID id;

    @Version
    @Column(
            nullable = false,
            columnDefinition = "integer default '0'"
    )
    private int version;

    @Column(name = "type_request")
    @Enumerated(EnumType.STRING)
    private Type typeRequest;

    @Column(name = "workDate")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dateWork;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "created_by")
    private Employee createdBy;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "updated_by")
    private Employee updateBy;

    @Column(name = "created_at")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createDate;

    @Column(name = "update_at")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updateDate;

    @Column(name = "request_number")
    private Integer requestNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    private Employee employee;

    @ManyToOne(fetch = FetchType.EAGER)
    private CustomerOrder customerOrder;

    @Column(name = "reason")
    @Enumerated(EnumType.STRING)
    private GeneralReason reason;

    @Column(name = "qty")
    private Integer qty;

    @ElementCollection
    @CollectionTable(name = "bid_inconsistencies", joinColumns = @JoinColumn(name = "bid_id"))
    @Column(name = "inconsistency")
    @Enumerated(EnumType.STRING)
    private Set<Inconsistency> inconsistency;

    @Column(name = "mlm_node")
    @Enumerated(EnumType.STRING)
    private MlmNode mlmNode;

    @Column(name = "item")
    @Enumerated(EnumType.STRING)
    private Item item;

    @Column(name = "status_id")
    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(name = "comment")
    private String comment;

    @Column(name = "reason_wr")
    private String reason_wr;

    @Column(name = "description")
    private String description;

    @OneToMany(mappedBy = "request", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Images> images = new ArrayList<>();

    @Column(name = "closed_date")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime closeDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "closed_employee")
    private Employee closedEmployee;

    @Column(name = "chat_id")
    private Long chatId;

    @Column(name = "message_id")
    private Integer messageId;

    @Column(name = "score")
    @Enumerated(EnumType.STRING)
    private Appraisal score;

    @OneToMany(mappedBy = "request", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RequestLog> log = new ArrayList<>();

    public String getReason_wr() {
        return reason_wr;
    }

    public void setReason_wr(String reason_wr) {
        this.reason_wr = reason_wr;
    }

    public Item getItem() {
        return item;
    }

    public void setItem(Item item) {
        this.item = item;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public int getVersion() {
        return version;
    }

    public void setVersion(int version) {
        this.version = version;
    }

    public Type getTypeRequest() {
        return typeRequest;
    }

    public void setTypeRequest(Type typeRequest) {
        this.typeRequest = typeRequest;
    }

    public LocalDateTime getDateWork() {
        return dateWork;
    }

    //Если старая версия не в работе и новая версия в работе
    public void setDateWork(LocalDateTime dateWork) {
        if (version<= 1&& status.equals(Status.InWork)) {
            this.dateWork = dateWork;
        }
    }

    public Employee getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Employee createdBy) {
        this.createdBy = createdBy;
    }

    public Employee getUpdateBy() {
        return updateBy;
    }

    public void setUpdateBy(Employee updateBy) {
        this.updateBy = updateBy;
    }

    public LocalDateTime getCreateDate() {
        return createDate;
    }

    public void setCreateDate(LocalDateTime createDate) {
        this.createDate = createDate;
    }

    public LocalDateTime getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(LocalDateTime updateDate) {
        this.updateDate = updateDate;
    }

    public Integer getRequestNumber() {
        return requestNumber;
    }

    public void setRequestNumber(Integer requestNumber) {
        this.requestNumber = requestNumber;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public CustomerOrder getCustomerOrder() {
        return customerOrder;
    }

    public void setCustomerOrder(CustomerOrder customerOrder) {
        this.customerOrder = customerOrder;
    }

    public GeneralReason getReason() {
        return reason;
    }

    public void setReason(GeneralReason reason) {
        this.reason = reason;
    }

    public Integer getQty() {
        return qty;
    }

    public void setQty(Integer qty) {
        this.qty = qty;
    }

    public Set<Inconsistency> getInconsistency() {
        return inconsistency;
    }

    public void setInconsistency(Set<Inconsistency> inconsistency) {
        this.inconsistency = inconsistency;
    }

    public MlmNode getMlmNode() {
        return mlmNode;
    }

    public void setMlmNode(MlmNode mlmNode) {
        this.mlmNode = mlmNode;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        if (this.status!=null) {
            if (this.status.equals(Status.Closed) || this.status.equals(Status.Cancel)) {
                closedEmployee = null;
                closeDate = null;
                messageId = null;
                score = null;
            }
        }
        this.status = status;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Images> getImages() {
        return images;
    }

    public void setImages(List<Images> images) {
        this.images = images;
    }

    public LocalDateTime getCloseDate() {
        return closeDate;
    }

    public void setCloseDate(LocalDateTime closeDate) {
        this.closeDate = closeDate;
    }

    public Employee getClosedEmployee() {
        return closedEmployee;
    }

    public void setClosedEmployee(Employee closedEmployee) {
        this.closedEmployee = closedEmployee;
    }

    public Long getChatId() {
        return chatId;
    }

    public void setChatId(Long chatId) {
        this.chatId = chatId;
    }

    public Integer getMessageId() {
        return messageId;
    }

    public void setMessageId(Integer messageId) {
        this.messageId = messageId;
    }

    public Appraisal getScore() {
        return score;
    }

    public void setScore(Appraisal score) {
        this.score = score;
    }

    public List<RequestLog> getLog() {
        return log;
    }

    public void setLog(List<RequestLog> log) {
        this.log = log;
    }

    @Override
    public Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
}
