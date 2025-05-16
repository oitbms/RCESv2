package com.example.rces.controller.payload;

import java.time.LocalDateTime;

public record ExecutionsPayload(LocalDateTime executionDate, String report) {
}
