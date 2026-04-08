package com.example.rces.mapper;

import com.example.rces.dto.FileDTO;
import com.example.rces.dto.PartsDirectoryCreateDTO;
import com.example.rces.dto.PartsDirectoryDTO;
import com.example.rces.models.DocumentFile;
import com.example.rces.models.PartsDirectory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PartsDirectoryMapper extends BaseMapper<PartsDirectory, PartsDirectoryDTO, PartsDirectoryCreateDTO> {

    @Override
    @Mapping(target = "customerOrder", ignore = true)
    PartsDirectory toEntityFromCreateDTO(PartsDirectoryCreateDTO createDto);
}
