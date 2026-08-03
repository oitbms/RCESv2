package com.example.rces.dto;

import com.example.rces.models.Images;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class AuthorControlDeviationDto {

    private Long id;
    private String itemName;
    private String inconsistency;
    private SubDivisionDTO subDivisionDto;
    private String periodRemoval;
    private String dateRemoval;
    private List<Images> images = new ArrayList<>();
    private List<Images> imagesCorrections = new ArrayList<>();
    private Long authorControl;
    private Boolean success;
    private String description;
    private int deviationNumber;

}
