package com.example.rces.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeWorkCalendarDto {

    private Long id;
    private String username;
    private String subDivisionName;
    private String workDate;
    private String workTime;
    private Long userShiftsId;
    private String shiftsName;

}
