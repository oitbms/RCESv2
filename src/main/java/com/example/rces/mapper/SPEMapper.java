package com.example.rces.mapper;

import com.example.rces.dto.SpeCreateDTO;
import com.example.rces.dto.SpeDTO;
import com.example.rces.models.SPE;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        uses = {
                EmployeeMapper.class,
                SubDivisionMapper.class
        })
public interface SPEMapper extends BaseMapper<SPE, SpeDTO, SpeCreateDTO> {

    @Override
    SPE toEntityFromCreateDTO(SpeCreateDTO dto);

    @Override
    SPE toEntity(SpeDTO dto);

    @Override
    @Mapping(target = "documentId", source = "document.id")
    SpeDTO toDTO(SPE entity);

    @Override
    void update(SpeDTO dto, @MappingTarget SPE entity);
}
