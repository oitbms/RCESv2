package com.example.rces.mapper;

import com.example.rces.dto.SpeCreateDTO;
import com.example.rces.dto.SpeDTO;
import com.example.rces.models.SPE;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring",
        uses = {
                EmployeeMapper.class
        })
public interface SPEMapper {

    @Mapping(target = "number", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "color", ignore = true)
    SPE to(SpeCreateDTO dto);

    @Mapping(target = "number", ignore = true)
    SPE to(SpeDTO dto);

    SpeDTO from(SPE entity);

    @Mapping(target = "number", ignore = true)
    void update(SpeDTO dto, @MappingTarget SPE entity);
}
