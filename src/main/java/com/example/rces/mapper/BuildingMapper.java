package com.example.rces.mapper;

import com.example.rces.dto.BuildingCreateDto;
import com.example.rces.dto.BuildingDto;
import com.example.rces.dto.BuildingUpdateDto;
import com.example.rces.models.Building;
import org.mapstruct.*;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface BuildingMapper {


    Building toEntity(BuildingCreateDto buildingCreateDto);

    @Mapping(target = "subDivisionId", source = "subdivision.id")
    @Mapping(target = "subDivisionName", source = "subdivision.name")
    BuildingDto toDto(Building building);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "subdivision", ignore = true)
    @Mapping(target = "document", ignore = true)
    @Mapping(target = "otherText", ignore = true)
    @Mapping(target = "otherDocument", ignore = true)
    Building toUpdateEntity(@MappingTarget Building building, BuildingUpdateDto buildingUpdateDto);

}
