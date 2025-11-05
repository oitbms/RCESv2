package com.example.rces.service;

import com.example.rces.dto.DocumentCreateDTO;
import com.example.rces.dto.DocumentDTO;
import com.example.rces.dto.FileDTO;
import com.example.rces.models.Document;
import com.example.rces.models.DocumentFile;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface DocumentService {

    Document createDocument(DocumentCreateDTO dto);

    Document createDocument(DocumentCreateDTO dto, Object file);

    DocumentDTO toDTO(Document document);

    DocumentDTO getDocumentById(UUID id);

    DocumentDTO addFileToDocument(UUID id, List<MultipartFile> files);

    void deleteFileFromDocument(UUID fileId);

    void deleteDocument(UUID id);

    FileDTO downloadFile(UUID fileId);
}
