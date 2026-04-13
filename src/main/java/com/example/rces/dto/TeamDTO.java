package com.example.rces.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TeamDTO {

    private Long id;
    private Long version;
    private String name;
    private List<EmployeeDTO> employees;
}
