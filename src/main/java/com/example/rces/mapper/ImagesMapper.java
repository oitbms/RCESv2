package com.example.rces.mapper;

import com.example.rces.dto.ImagesDTO;
import com.example.rces.models.Images;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ImagesMapper extends BaseMapper<Images, ImagesDTO, ImagesDTO> {

    @Override
    @Mapping(target = "data", source = "base64Data")
    @Mapping(target = "mainlink", source = "mainlinkId")
    ImagesDTO toDTO(Images image);

}
