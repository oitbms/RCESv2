package com.example.rces.controller.rest;

import com.example.rces.dto.DocumentDTO;
import com.example.rces.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/document")
public class DocumentRestController {

    private final DocumentService documentService;

    @Autowired
    public DocumentRestController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @GetMapping("/get-document/{id}")
    public ResponseEntity<DocumentDTO> getDocument(@PathVariable UUID id) {
        return ResponseEntity.ok(documentService.getDocumentById(id));
    }

    @PatchMapping("/add-file-to-document/{id}")
    public ResponseEntity<DocumentDTO> addFileToDocument(@PathVariable UUID id, @RequestParam List<MultipartFile> files) {
        return ResponseEntity.ok(documentService.addFileToDocument(id, files));
    }

    @DeleteMapping("/delete-file-from-document")
    public ResponseEntity<Void> deleteFileFromDocument(@RequestParam UUID fileId) {
        documentService.deleteFileFromDocument(fileId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete-document/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable UUID id) {
        documentService.deleteDocument(id);
        return ResponseEntity.ok().build();
    }



}
