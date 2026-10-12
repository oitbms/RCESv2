package com.example.rces.exception;

public class FieldValidationException extends RuntimeException {

    private final int status;
    private final String field;

    public FieldValidationException(int status, String field, String message) {
        super(message);
        this.status = status;
        this.field = field;
    }

    public int getStatus() {
        return status;
    }

    public String getField() {
        return field;
    }
}
