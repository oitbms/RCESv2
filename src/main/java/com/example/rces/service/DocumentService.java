package com.example.rces.service;

import com.example.rces.dto.DocumentCreateDTO;
import com.example.rces.dto.DocumentDTO;

import java.util.Map;
import java.util.UUID;

public interface DocumentService {

    DocumentDTO createDocument(DocumentCreateDTO dto);

    DocumentDTO updateDocument(UUID id, Long version, Map<String, Object> changes);

    void deleteDocumentFile(UUID id);
}
