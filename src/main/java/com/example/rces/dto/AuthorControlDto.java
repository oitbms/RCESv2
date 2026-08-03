package com.example.rces.dto;

import com.example.rces.models.enums.StatusAuthor;
import com.example.rces.models.enums.TypeAuthor;
import lombok.Data;

import java.util.List;

@Data
public class AuthorControlDto {

    private Long id;
    private SiteDto site;
    private Boolean inconsistency;
    private String customerOrderStrCode;
    private String siteCode;
    private EmployeeDTO employee;
    private SubDivisionDTO subDivision;
    private StatusAuthor statusAuthor;
    private TypeAuthor typeAuthor;
    private String createdAt;
    private String updatedAt;
    private List<AuthorControlDeviationDto> authorControls;

}
