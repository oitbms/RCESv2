package com.example.rces.mapper;

import com.example.rces.dto.DocumentCreateDTO;
import com.example.rces.dto.DocumentDTO;
import com.example.rces.models.Document;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring",
        uses = {
                DocumentFileMapper.class
        })
public interface DocumentMapper extends BaseMapper<Document, DocumentDTO, DocumentCreateDTO> {

}
