package com.example.rces.dto;

import jakarta.validation.constraints.Size;

public class OtherTextDto {

    public static final int MAX_LENGTH = 10000;

    @Size(max = MAX_LENGTH, message = "Текст не должен превышать 10000 символов")
    private String text;

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
