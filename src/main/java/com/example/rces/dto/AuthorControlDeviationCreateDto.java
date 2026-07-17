package com.example.rces.dto;

import com.example.rces.models.Images;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
public class AuthorControlDeviationCreateDto {

    private String itemName;
    private String inconsistency;
    private SubDivisionDTO subDivisionDto;
    private LocalDate periodRemoval;
    private LocalDate dateRemoval;
    private List<Images> images = new ArrayList<>();
    private AuthorControlDto authorControl;
    private Boolean success;

}
