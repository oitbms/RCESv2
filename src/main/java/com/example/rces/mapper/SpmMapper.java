package com.example.rces.mapper;

import com.example.rces.dto.SpmCreateDTO;
import com.example.rces.dto.SpmDTO;
import com.example.rces.models.Spm;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = CustomerOrderMapper.class)
public interface SpmMapper extends BaseMapper<Spm, SpmDTO, SpmCreateDTO> {

    @Override
    @Mapping(target = "customerOrder", ignore = true)
    @Mapping(target = "loaded", ignore = true)
    Spm toEntityFromCreateDTO(SpmCreateDTO createDto);
}
