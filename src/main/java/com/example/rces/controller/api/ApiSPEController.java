package com.example.rces.controller.api;

import com.example.rces.dto.SpeCreateDTO;
import com.example.rces.dto.SpeDTO;
import com.example.rces.dto.SpeResponseDTO;
import com.example.rces.service.SpeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/spe")
public class ApiSPEController {

    private final SpeService service;

    @Autowired
    public ApiSPEController(SpeService service) {
        this.service = service;
    }

    @GetMapping("/get-page-spe")
    public ResponseEntity<SpeResponseDTO> getPage() {
        var allSpeList = service.getAllSPE();
        var responseDTO = new SpeResponseDTO(allSpeList);
        return ResponseEntity
                .ok(responseDTO);
    }

    @GetMapping("/create-spe")
    public ResponseEntity<SpeDTO> createSPE(@RequestBody SpeCreateDTO dto) {
        return ResponseEntity.ok(service.createSPE(dto));
    }

    @GetMapping("/update-spe")
    public ResponseEntity<SpeDTO> updateSPE(@RequestBody SpeDTO dto) {
        return ResponseEntity.ok(service.updateSPE(dto));
    }

}
