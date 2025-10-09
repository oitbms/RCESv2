package com.example.rces.mapper;

import com.example.rces.dto.SpeCreateDTO;
import com.example.rces.dto.SpeDTO;
import com.example.rces.models.SPE;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring",
        uses = {
                EmployeeMapper.class,
                SubDivisionMapper.class
        })
public interface SPEMapper extends BaseMapper<SPE, SpeDTO, SpeCreateDTO> {

    @Override
    @Mapping(target = "number", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "color", ignore = true)
    SPE toEntityFromCreateDTO(SpeCreateDTO dto);

    @Override
    @Mapping(target = "number", ignore = true)
    @Mapping(target = "document", ignore = true)
    SPE toEntity(SpeDTO dto);

    @Override
    @Mapping(target = "documentId", source = "document.id")
    SpeDTO toDTO(SPE entity);

    @Override
    @Mapping(target = "number", ignore = true)
    void update(SpeDTO dto, @MappingTarget SPE entity);
}
