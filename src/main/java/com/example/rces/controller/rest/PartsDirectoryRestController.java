package com.example.rces.controller.rest;

import com.example.rces.dto.*;
import com.example.rces.service.PartsDirectoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/parts-directory")
public class PartsDirectoryRestController {

    private final PartsDirectoryService service;

    @Autowired
    public PartsDirectoryRestController(PartsDirectoryService service) {
        this.service = service;
    }

    @GetMapping("/get-page-pdi")
    public ResponseEntity<RequestDataDTO> getPage() {
        var allPdiList = service.getAllPartsDirectory().stream().sorted(Comparator.comparing(PartsDirectoryDTO::getId)).toList();
        return ResponseEntity.ok(new RequestDataDTO(allPdiList, allPdiList.size()));
    }

    @PostMapping("/create-item")
    public ResponseEntity<PartsDirectoryDTO> createItem(@Valid @RequestBody PartsDirectoryCreateDTO dto) {
        var newPartsDirectory = service.createItem(dto);
        return ResponseEntity.ok(newPartsDirectory);
    }

    @PatchMapping("/update/{id}")
    public ResponseEntity<PartsDirectoryDTO> update(@PathVariable Long id,
                                                    @RequestParam Long version,
                                                    @RequestBody Map<String, Object> changes) {
        var updatedPDI = service.updatePdi(id, version, changes);
        return ResponseEntity.ok(updatedPDI);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        service.deletePdi(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/ready")
    public ResponseEntity<PartsDirectoryDTO> coordination(@RequestParam Long id,
                                                          @RequestParam(name = "ready") Boolean readyBoolean,
                                                          @RequestParam(required = false) List<String> operations) {
        PartsDirectoryDTO dto = service.readyOrNot(id, readyBoolean, operations);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/from-1c")
    public ResponseEntity<PartsDirectoryFrom1C> from1C(@RequestParam String customerOrder) {
        PartsDirectoryFrom1C dtoList = service.downloadFrom1C(customerOrder);
        return ResponseEntity.ok(dtoList);
    }

    @PostMapping("/create-item-from-1c")
    public ResponseEntity<List<PartsDirectoryDTO>> createItemsFrom1C(@RequestBody List<PartsDirectoryCreateDTOFrom1C> listDTO) {
        List<PartsDirectoryDTO> dtoList = service.createItemFrom1C(listDTO);
        return ResponseEntity.ok(dtoList);
    }

}
