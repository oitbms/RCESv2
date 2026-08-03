package com.example.rces.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AuthorControlCreateDto {

    @NotNull(message = "В акте надзора должна быть указана площадка изготовления")
    private SiteDto site;

    private Boolean inconsistency;

    @NotBlank(message = "В акте надзора должен быть указан заказ клиента")
    private String customerOrderStrCode;

    private String siteCode;

    @NotNull(message = "В акте надзора должен быть указан ответственный конструктор")
    private EmployeeDTO employee;

    private SubDivisionDTO subDivision;

    @NotBlank(message = "В акте надзора должен быть указан его тип")
    private String typeAuthor;

    @NotBlank(message = "В акте надзора не указан статус")
    private String statusAuthor;

}
