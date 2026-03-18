package com.example.rces.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class MaxMessageRequest {
    @JsonProperty("user_id")
    private Long userId;
    private String message;

    public MaxMessageRequest() {}

    public MaxMessageRequest(Long userId, String message) {
        this.userId = userId;
        this.message = message;
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
