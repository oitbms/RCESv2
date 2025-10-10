package com.example.rces.controller.rest;

import com.example.rces.dto.*;
import com.example.rces.service.SpeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/spe")
public class SPERestController {

    private final SpeService service;

    @Autowired
    public SPERestController(SpeService service) {
        this.service = service;
    }

    @PostMapping("/create-spe")
    public ResponseEntity<SpeDTO> createSPE(@RequestBody SpeCreateDTO dto) {
        var newSpe = service.createSPE(dto);
        return ResponseEntity.ok(newSpe);
    }

    @GetMapping("/get-page-spe")
    public ResponseEntity<SpeResponseDTO> getPage() {
        var allSpeList = service.getAllSPE();
        var responseDTO = new SpeResponseDTO(allSpeList);
        return ResponseEntity.ok(responseDTO);
    }

    @PatchMapping("/update/{number}")
    public ResponseEntity<SpeDTO> update(@PathVariable Integer number,
                                         @RequestParam Long version,
                                         @RequestBody Map<String, Object> changes) {
        var updatedSPE = service.updateSPE(number, version, changes);
        return ResponseEntity.ok(updatedSPE);
    }

    @PostMapping("/create-document/{number}")
    public ResponseEntity<DocumentDTO> createDocument(@PathVariable Integer number, @ModelAttribute DocumentCreateDTO dto) {
        return ResponseEntity.ok(service.createSpeDocument(number, dto));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> delete(@RequestBody SpeDTO speDTO) {
        service.deleteSpe(speDTO);
        return ResponseEntity.ok().build();
    }

}
