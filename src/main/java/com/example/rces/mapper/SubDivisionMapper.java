package com.example.rces.mapper;

import com.example.rces.dto.SubDivisionCreateDTO;
import com.example.rces.dto.SubDivisionDTO;
import com.example.rces.models.SubDivision;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SubDivisionMapper extends BaseMapper<SubDivision, SubDivisionDTO, SubDivisionCreateDTO> {



}
