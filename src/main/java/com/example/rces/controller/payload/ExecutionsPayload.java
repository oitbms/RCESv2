package com.example.rces.controller.payload;

import com.example.rces.models.FactExecutionSGI;

import java.util.List;
import java.util.UUID;

public record ExecutionsPayload(UUID id, String executionDate, String report, List<ImagesPayload> images) {

    public ExecutionsPayload(FactExecutionSGI factExecutionSGI) {
        this(
                factExecutionSGI.getId(),
                factExecutionSGI.getExecutionDate()!=null ? factExecutionSGI.getExecutionDate().toString() : null,
                factExecutionSGI.getReport(),
                factExecutionSGI.getImages().stream().map(fc -> new ImagesPayload(fc, factExecutionSGI.getId())).toList()
        );
    }
}
