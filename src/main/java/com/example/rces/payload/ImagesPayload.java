package com.example.rces.payload;

import com.example.rces.models.Images;

import java.util.UUID;

public record ImagesPayload(UUID id, String name, String data, UUID mainlink) {

    public ImagesPayload(Images image, UUID mainlink) {
        this(
                image.getId(),
                image.getName(),
                image.getBase64Data(),
                mainlink
        );
    }
}
