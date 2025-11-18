package com.example.rces.controller.rest;

import com.example.rces.dto.DocumentCreateDTO;
import com.example.rces.dto.DocumentDTO;
import com.example.rces.dto.NTDocumentCreateDTO;
import com.example.rces.dto.NTDocumentDTO;
import com.example.rces.service.StateStandardDocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/ntd")
public class NTDocumentRestController {

    private final StateStandardDocumentService service;

    @Autowired
    public NTDocumentRestController(StateStandardDocumentService service) {
        this.service = service;
    }

    @GetMapping("/get-page-ntd")
    public ResponseEntity<List<NTDocumentDTO>> getPage() {
        var allSpeList = service.getAllNTDocuments().stream().sorted(Comparator.comparing(NTDocumentDTO::getId)).toList();
        return ResponseEntity.ok(allSpeList);
    }

    @PostMapping("/create-ntd")
    public ResponseEntity<NTDocumentDTO> createSPE(@RequestBody NTDocumentCreateDTO dto) {
        var newNtd = service.createNtDocument(dto);
        return ResponseEntity.ok(newNtd);
    }

    @PatchMapping("/update/{id}")
    public ResponseEntity<NTDocumentDTO> update(@PathVariable UUID id,
                                                @RequestParam Long version,
                                                @RequestBody Map<String, Object> changes) {
        var updatedNtd = service.updateNtDocument(id, version, changes);
        return ResponseEntity.ok(updatedNtd);
    }

    @PostMapping("/create-document/{id}")
    public ResponseEntity<DocumentDTO> createDocument(@PathVariable UUID id, @ModelAttribute DocumentCreateDTO dto) {
        return ResponseEntity.ok(service.createDocumentForNTD(service.findById(id), dto, null));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.deleteNtd(id);
        return ResponseEntity.ok().build();
    }
}
