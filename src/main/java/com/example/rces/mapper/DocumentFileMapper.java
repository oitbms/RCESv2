package com.example.rces.mapper;

import com.example.rces.dto.DocumentFileDTO;
import com.example.rces.models.DocumentFile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DocumentFileMapper  {

    DocumentFileDTO toDTO(DocumentFile entity);

}
