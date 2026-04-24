package com.example.rces.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UserShiftsResponse {

    private String employeeName;
    private String shiftName;
    private LocalDate startDate;
    private LocalDate endDate;

}
