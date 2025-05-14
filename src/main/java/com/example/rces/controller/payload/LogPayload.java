package com.example.rces.controller.payload;

import java.time.LocalDateTime;
import java.util.Map;

public record LogPayload(LocalDateTime date, String userName, Map<String, String> metadata) {
}
