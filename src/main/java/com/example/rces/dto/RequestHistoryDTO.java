package com.example.rces.dto;

import com.example.rces.models.Inconsistency;
import com.example.rces.models.Requests;
import com.example.rces.models.SubDivision;
import com.example.rces.models.enums.GeneralReason;
import com.example.rces.models.enums.Item;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

public class RequestHistoryDTO {

    private UUID requestId;
    private RequestHistoryData requestData;
    private Long revisionNumber;
    private LocalDateTime revisionDate;
    private String revisionType;
    private String changedBy;


    public static class RequestHistoryData {
        private Requests.Type typeRequest;
        private LocalDateTime dateWork;
        private Integer requestNumber;
        private GeneralReason reason;
        private Integer qty;
        private SubDivision mlmNode;
        private Item item;
        private String status;
        private String comment;
        private String reason_wr;
        private String description;
        private LocalDateTime closeDate;
        private String control;
        private String commentAgreed;
        private String title;
        private int qtyRejected;
        private Set<String> inconsistencies;

        public RequestHistoryData() {
        }

        public Set<String> getInconsistencies() {
            return inconsistencies;
        }

        public void setInconsistencies(Set<String> inconsistencies) {
            this.inconsistencies = inconsistencies;
        }

        public Requests.Type getTypeRequest() {
            return typeRequest;
        }

        public void setTypeRequest(Requests.Type typeRequest) {
            this.typeRequest = typeRequest;
        }

        public LocalDateTime getDateWork() {
            return dateWork;
        }

        public void setDateWork(LocalDateTime dateWork) {
            this.dateWork = dateWork;
        }

        public Integer getRequestNumber() {
            return requestNumber;
        }

        public void setRequestNumber(Integer requestNumber) {
            this.requestNumber = requestNumber;
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

        public SubDivision getMlmNode() {
            return mlmNode;
        }

        public void setMlmNode(SubDivision mlmNode) {
            this.mlmNode = mlmNode;
        }

        public Item getItem() {
            return item;
        }

        public void setItem(Item item) {
            this.item = item;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getComment() {
            return comment;
        }

        public void setComment(String comment) {
            this.comment = comment;
        }

        public String getReason_wr() {
            return reason_wr;
        }

        public void setReason_wr(String reason_wr) {
            this.reason_wr = reason_wr;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public LocalDateTime getCloseDate() {
            return closeDate;
        }

        public void setCloseDate(LocalDateTime closeDate) {
            this.closeDate = closeDate;
        }

        public String getControl() {
            return control;
        }

        public void setControl(String control) {
            this.control = control;
        }

        public String getCommentAgreed() {
            return commentAgreed;
        }

        public void setCommentAgreed(String commentAgreed) {
            this.commentAgreed = commentAgreed;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public int getQtyRejected() {
            return qtyRejected;
        }

        public void setQtyRejected(int qtyRejected) {
            this.qtyRejected = qtyRejected;
        }

        public static RequestHistoryData from(Requests request) {
            RequestHistoryData data = new RequestHistoryData();
            data.setTypeRequest(request.getTypeRequest());
            data.setDateWork(request.getDateWork());
            data.setRequestNumber(request.getRequestNumber());
            data.setReason(request.getReason());
            data.setQty(request.getQty());
            data.setMlmNode(request.getSubDivision());
            data.setItem(request.getItem());
            data.setStatus(request.getStatus().getName());
            data.setComment(request.getComment());
            data.setReason_wr(request.getReason_wr());
            data.setDescription(request.getDescription());
            data.setCloseDate(request.getCloseDate());
            data.setControl(request.getControl());
            data.setCommentAgreed(request.getCommentAgreed());
            data.setTitle(request.getTitle());
            data.setQtyRejected(request.getQtyRejected());
            if (request.getInconsistencies() != null) {
                Set<String> inconsistencyNames = request.getInconsistencies().stream()
                        .map(Inconsistency::getName)
                        .collect(Collectors.toSet());
                data.setInconsistencies(inconsistencyNames);
            }
            return data;
        }
    }

    // Геттеры и сеттеры для основного класса
    public UUID getRequestId() {
        return requestId;
    }

    public void setRequestId(UUID requestId) {
        this.requestId = requestId;
    }

    public RequestHistoryData getRequestData() {
        return requestData;
    }

    public void setRequestData(RequestHistoryData requestData) {
        this.requestData = requestData;
    }

    public Long getRevisionNumber() {
        return revisionNumber;
    }

    public void setRevisionNumber(Long revisionNumber) {
        this.revisionNumber = revisionNumber;
    }

    public LocalDateTime getRevisionDate() {
        return revisionDate;
    }

    public void setRevisionDate(LocalDateTime revisionDate) {
        this.revisionDate = revisionDate;
    }

    public String getRevisionType() {
        return revisionType;
    }

    public void setRevisionType(String revisionType) {
        this.revisionType = revisionType;
    }

    public String getChangedBy() {
        return changedBy;
    }

    public void setChangedBy(String changedBy) {
        this.changedBy = changedBy;
    }

}