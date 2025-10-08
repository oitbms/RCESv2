package com.example.rces.service;

import com.example.rces.dto.SubDivisionDTO;

import java.util.List;

public interface SubDivisionService {

    SubDivisionDTO getByName(String name);

    List<SubDivisionDTO> getAll();

}
