package com.example.rces.service.impl;

import com.example.rces.dto.DocumentCreateDTO;
import com.example.rces.dto.DocumentDTO;
import com.example.rces.mapper.DocumentMapper;
import com.example.rces.models.Document;
import com.example.rces.repository.DocumentFilesRepository;
import com.example.rces.repository.DocumentRepository;
import com.example.rces.service.DocumentService;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.OptimisticLockException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

import static com.example.rces.utils.FilesUtil.addFilesToDocument;
import static com.example.rces.utils.FilesUtil.validateDocument;

@Service
@Transactional(transactionManager = "primaryTransactionManager")
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository repository;
    private final DocumentFilesRepository filesRepository;
    private final DocumentMapper mapper;
    private final ObjectMapper objectMapper;

    @Autowired
    public DocumentServiceImpl(DocumentRepository repository, DocumentFilesRepository filesRepository, DocumentMapper mapper, ObjectMapper objectMapper) {
        this.repository = repository;
        this.filesRepository = filesRepository;
        this.mapper = mapper;
        this.objectMapper = objectMapper;
    }

    @Override
    public DocumentDTO createDocument(DocumentCreateDTO dto) {
        validateDocument(dto);

        Document document = new Document();
        document.setName(dto.getName());
        try {
            document.setFiles(addFilesToDocument(document, dto.getFiles()));
        } catch (IOException e) {
            throw new ApplicationContextException("Ошибка при добавления файла в документ");
        }
        repository.save(document);
        return mapper.toDTO(document);
    }

    @Override
    public DocumentDTO updateDocument(UUID id, Long version, Map<String, Object> changes) {
        Document documentEntity = repository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(String.format("Документ с id %s не найден", id)));
        if (!Objects.equals(documentEntity.getVersion(), version)) {
            throw new OptimisticLockException("Документ с id " + id + " устарел");
        }
        try {
            objectMapper.updateValue(documentEntity, changes);
        } catch (JsonMappingException e) {
            throw new ApplicationContextException("Ошибка при обновлении Документа", e);
        }
        repository.save(documentEntity);
        return mapper.toDTO(documentEntity);
    }

    public void deleteDocumentFile(UUID id) {
        filesRepository.deleteById(id);
    }

}
