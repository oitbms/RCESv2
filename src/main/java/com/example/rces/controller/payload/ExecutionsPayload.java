package com.example.rces.controller.payload;

import java.time.LocalDate;
import java.util.UUID;

public record ExecutionsPayload(UUID id, String executionDate, String report) {
}
