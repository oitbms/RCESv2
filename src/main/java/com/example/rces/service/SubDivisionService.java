package com.example.rces.service;

import com.example.rces.dto.SubDivisionDTO;
import com.example.rces.models.SubDivision;

import java.util.List;

public interface SubDivisionService {

    SubDivision getByName(String name);

    SubDivisionDTO getDTOByName(String name);

    List<SubDivisionDTO> getAll();

}
