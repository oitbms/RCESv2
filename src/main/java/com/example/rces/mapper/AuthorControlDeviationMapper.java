package com.example.rces.mapper;

import com.example.rces.dto.AuthorControlDeviationCreateDto;
import com.example.rces.dto.AuthorControlDeviationDto;
import com.example.rces.models.AuthorControlDeviation;
import org.mapstruct.*;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        imports = {DateTimeFormatter.class}
)
public interface AuthorControlDeviationMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "authorControl", ignore = true)
    @Mapping(target = "subDivision", source = "subDivisionDto")
    AuthorControlDeviation toEntity(AuthorControlDeviationCreateDto authorControlDeviation);

    @Mapping(target = "authorControl", expression = "java(authorControlDeviation.getAuthorControl().getId())")
    @Mapping(target = "subDivisionDto", source = "subDivision")
    AuthorControlDeviationDto toDto(AuthorControlDeviation authorControlDeviation);

    @Mapping(target = "authorControl", ignore = true)
    @Mapping(target = "deviationNumber", ignore = true)
    @Mapping(target = "images", ignore = true)
    @Mapping(target = "imagesCorrections", ignore = true)
    AuthorControlDeviation toUpdateEntity(@MappingTarget AuthorControlDeviation authorControlDeviation, AuthorControlDeviationDto authorControlDeviationDto);

    @Mapping(target = "periodRemoval", expression = "java(authorControlDeviations.getPeriodRemoval() != null ? authorControlDeviations.getPeriodRemoval().format(DateTimeFormatter.ofPattern(\"yyyy-MM-dd\"))")
    @Mapping(target = "dateRemoval", expression = "java(authorControlDeviations.getDateRemoval() != null ? authorControlDeviations.getDateRemoval().format(DateTimeFormatter.ofPattern(\"yyyy-MM-dd\"))")
    List<AuthorControlDeviationDto> toDtos(List<AuthorControlDeviation> authorControlDeviations);
}
