package com.example.rces.mapper;

import com.example.rces.dto.MachineCreateDto;
import com.example.rces.dto.MachineDto;
import com.example.rces.models.Machine;
import org.mapstruct.*;

import java.util.List;

@Mapper(
    componentModel = "spring",
    uses = {EmployeeMapper.class, ImagesMapper.class},
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface MachineMapper {

    List<MachineDto> toDTOList(List<Machine> machines);

    @Mapping(target = "subDivisionId", source = "subdivision.id")
    @Mapping(target = "subDivisionName", source = "subdivision.name")
    MachineDto toDto(Machine machine);

    Machine toEntityFromCreateDto(MachineCreateDto createDto);

    @Mapping(target = "admittedEmployees", source = "admittedEmployeesList")
    @Mapping(target = "responsibleEmployees", source = "responsibleEmployeesList")
    @Mapping(target = "subdivision", ignore = true)
    @Mapping(target = "passport", ignore = true)
    @Mapping(target = "document", ignore = true)
    @Mapping(target = "otherText", ignore = true)
    @Mapping(target = "otherDocument", ignore = true)
    Machine updateEntity(@MappingTarget Machine machine, MachineDto dto);

}
