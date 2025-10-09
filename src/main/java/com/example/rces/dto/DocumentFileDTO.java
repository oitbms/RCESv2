package com.example.rces.dto;

public class DocumentFileDTO {

    private String type;

    private byte[] file;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public byte[] getFile() {
        return file;
    }

    public void setFile(byte[] file) {
        this.file = file;
    }
}
