package com.example.rces.mapper;

import com.example.rces.dto.AuthorControlCreateDto;
import com.example.rces.dto.AuthorControlDeviationDto;
import com.example.rces.dto.AuthorControlDto;
import com.example.rces.models.AuthorControl;
import com.example.rces.models.AuthorControlDeviation;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        imports = {DateTimeFormatter.class, ZoneId.class},
        uses = {AuthorControlDeviationMapper.class}
)
public interface AuthorControlMapper {

    @Mapping(target = "authorControls", expression = "java(convertDeviations(authorControl.getAuthorControlDeviations()))")
    @Mapping(target = "createdAt", expression = "java(authorControl.getCreatedDate().atZone(ZoneId.systemDefault()).toLocalDateTime().format(DateTimeFormatter.ofPattern(\"yyyy-MM-dd HH:mm\")))")
    @Mapping(target = "updatedAt", expression = "java(authorControl.getUpdatedDate() != null ? authorControl.getUpdatedDate().atZone(ZoneId.systemDefault()).toLocalDateTime().format(DateTimeFormatter.ofPattern(\"yyyy-MM-dd HH:mm\")) : null)")
    AuthorControlDto toDto(AuthorControl authorControl);

    AuthorControl toEntity(AuthorControlCreateDto authorControlDto);

    @Mapping(target = "id", ignore = true)
    AuthorControl toUpdateDto(@MappingTarget AuthorControl authorControl, AuthorControlDto authorControlDto);

    default List<AuthorControlDeviationDto> convertDeviations(List<AuthorControlDeviation> deviations) {
        if (deviations == null) {
            return null;
        }

        AuthorControlDeviationMapper mapper = Mappers.getMapper(AuthorControlDeviationMapper.class);
        return mapper.toDtos(deviations);
    }
}
