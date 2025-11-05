package com.example.rces.service.impl;

import com.example.rces.dto.DocumentCreateDTO;
import com.example.rces.dto.DocumentDTO;
import com.example.rces.dto.FileDTO;
import com.example.rces.mapper.DocumentMapper;
import com.example.rces.mapper.FileMapper;
import com.example.rces.models.Document;
import com.example.rces.models.DocumentFile;
import com.example.rces.repository.DocumentFilesRepository;
import com.example.rces.repository.DocumentRepository;
import com.example.rces.service.DocumentService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static com.example.rces.utils.DateUtil.formatedDate;
import static com.example.rces.utils.FilesUtil.*;

@Service
@Transactional(transactionManager = "primaryTransactionManager")
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository repository;
    private final DocumentFilesRepository filesRepository;
    private final DocumentMapper mapper;
    private final FileMapper fileMapper;

    @Autowired
    public DocumentServiceImpl(DocumentRepository repository, DocumentFilesRepository filesRepository, DocumentMapper mapper, FileMapper fileMapper) {
        this.repository = repository;
        this.filesRepository = filesRepository;
        this.mapper = mapper;
        this.fileMapper = fileMapper;
    }

    @Override
    public Document createDocument(DocumentCreateDTO dto) {
        validateDocument(dto);
        Document document = new Document();
        document.setName(Optional.ofNullable(dto.getName())
                .orElse(String.format("Документ от %s", formatedDate(LocalDateTime.now()))));
        setFileToDocument(document, document.getFiles());
        document.setImages(addImages(dto.getImages(), document));
        return repository.save(document);
    }

    @Override
    public Document createDocument(DocumentCreateDTO dto, Object file) {
        validateDocument(dto);
        Document document = new Document();
        document.setName(dto.getName());
        setFileToDocument(document, file);
        return repository.save(document);
    }

    @Override
    public DocumentDTO toDTO(Document document) {
        return mapper.toDTO(document);
    }

    @Override
    public DocumentDTO getDocumentById(UUID id) {
        Document document = repository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(String.format("Документ с id=%s не найден", id)));
        return mapper.toDTO(document);
    }

    @Override
    public DocumentDTO addFileToDocument(UUID id, List<MultipartFile> files) {
        Document document = repository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(String.format("Документ с id=%s не найден", id)));
        document.getFiles().addAll(addFilesToDocument(document, files));
        repository.save(document);
        return mapper.toDTO(document);
    }

    @Override
    public void deleteFileFromDocument(UUID fileId) {
        filesRepository.deleteById(fileId);
    }

    @Override
    public void deleteDocument(UUID id) {
        repository.deleteById(id);
    }

    @Override
    public FileDTO downloadFile(UUID fileId) {
        DocumentFile file = filesRepository.findById(fileId).orElseThrow(
                () -> new EntityNotFoundException(String.format("Файл с id=%s не найден", fileId)));
        return fileMapper.toDTO(file);
    }

    private void setFileToDocument(Document document, Object data) {
        if (data instanceof byte[] bytes) {
            DocumentFile file = com.example.rces.utils.FilesUtil.addFileToDocument(document, bytes);
            document.getFiles().add(file);
        } else if (data instanceof List<?> fileList && !fileList.isEmpty() && fileList.get(0) instanceof MultipartFile) {
            List<DocumentFile> files = com.example.rces.utils.FilesUtil.addFilesToDocument(document, (List<MultipartFile>) fileList);
            document.getFiles().addAll(files);
        }
    }

}
