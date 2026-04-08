package com.example.rces.controller.rest;

import com.example.rces.dto.PartsDirectoryCreateDTO;
import com.example.rces.dto.PartsDirectoryDTO;
import com.example.rces.dto.RequestDataDTO;
import com.example.rces.service.PartsDirectoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
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
    public ResponseEntity<PartsDirectoryDTO> createItem(@RequestBody PartsDirectoryCreateDTO dto) {
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

}
