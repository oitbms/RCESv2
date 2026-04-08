package com.example.rces.dto;

import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Builder
public class PartsDirectoryDTO {

    private Long id;

    private Long version;

    private CustomerOrderDTO customerOrder;

    private EmployeeDTO employee;

    private String name;

    private String scheme;

    private String thickness;

    private String steel;

    private Integer qty;

    private Integer qtyCompleted;

    private String measurements;

    private String program;

    private String machine;

    private String status;

    private String comment;

    private String color;

    private LocalDateTime dateCompletion;

}
