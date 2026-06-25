package com.example.rces.controller.rest;

import com.example.rces.dto.RequestDataDTO;
import com.example.rces.dto.SpmCreateDTO;
import com.example.rces.dto.SpmDTO;
import com.example.rces.service.SpmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/spm")
public class SpmRestController {

    private final SpmService service;

    @Autowired
    public SpmRestController(SpmService service) {
        this.service = service;
    }

    @GetMapping("/get-page-spm")
    public ResponseEntity<RequestDataDTO> getPage() {
        var allSpmList = service.getAllSpm().stream()
                .sorted(Comparator.comparing(SpmDTO::getId)).toList();
        return ResponseEntity.ok(new RequestDataDTO(allSpmList, allSpmList.size()));
    }

    @PostMapping("/create-item")
    public ResponseEntity<SpmDTO> createItem(@RequestBody SpmCreateDTO dto) {
        var newSpm = service.createItem(dto);
        return ResponseEntity.ok(newSpm);
    }

    @PatchMapping("/update/{id}")
    public ResponseEntity<SpmDTO> update(@PathVariable Long id,
                                          @RequestParam Long version,
                                          @RequestBody Map<String, Object> changes) {
        var updatedSpm = service.updateSpm(id, version, changes);
        return ResponseEntity.ok(updatedSpm);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        service.deleteSpm(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/create-item-from-spm")
    public ResponseEntity<List<SpmDTO>> createItemFromSpm(@RequestBody List<SpmCreateDTO> listDTO) {
        List<SpmDTO> dtoList = service.createItemFromSpm(listDTO);
        return ResponseEntity.ok(dtoList);
    }
}
