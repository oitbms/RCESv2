package com.example.rces.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class MaxMessageResponse {
    private String status;

    @JsonProperty("message_id")
    private Long messageId;

    private String error;

    public MaxMessageResponse() {
    }

    public MaxMessageResponse(String status, Long messageId, String error) {
        this.status = status;
        this.messageId = messageId;
        this.error = error;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public Long getMessageId() {
        return messageId;
    }

    public void setMessageId(Long messageId) {
        this.messageId = messageId;
    }
}
