package com.example.rces.controller.payload;

import java.time.LocalDateTime;
import java.util.UUID;

public record ExecutionsPayload(UUID id, LocalDateTime executionDate, String report) {
}
