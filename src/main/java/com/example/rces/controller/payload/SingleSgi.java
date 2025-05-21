package com.example.rces.controller.payload;

import java.time.LocalDate;

public record SingleSgi(String employee, LocalDate planDate, String comment) {
}
