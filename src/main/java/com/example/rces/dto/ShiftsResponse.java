package com.example.rces.dto;

import lombok.Data;

import java.time.LocalTime;

@Data
public class ShiftsResponse {

    private Long id;
    private String name;
    private LocalTime startTime;
    private LocalTime endTime;

}
