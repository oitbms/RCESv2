package com.example.rces.controller;

import com.example.rces.dto.DocumentCreateDTO;
import com.example.rces.dto.DocumentDTO;
import com.example.rces.dto.SpeDTO;
import com.example.rces.service.SpeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/spe")
public class SPEController {

    private final SpeService service;

    @Autowired
    public SPEController(SpeService service) {
        this.service = service;
    }

    @GetMapping
    public String getSPEForm() {
        return "spe";
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
