package com.example.rces.controller.rest;

import com.example.rces.dto.BuildingCreateDto;
import com.example.rces.dto.BuildingDto;
import com.example.rces.dto.BuildingUpdateDto;
import com.example.rces.dto.OtherTextDto;
import com.example.rces.models.DocumentFile;
import com.example.rces.service.BuildingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/sub-division")
@RequiredArgsConstructor
public class BuildingRestController {

    private final BuildingService buildingService;

    @GetMapping("/{id}")
    public ResponseEntity<BuildingDto> getSubDivision(@PathVariable Long id) {
        BuildingDto subDivisionDTO = buildingService.getById(id);
        return ResponseEntity.ok(subDivisionDTO);
    }

    @GetMapping()
    public ResponseEntity<List<BuildingDto>> getAllSubDivisions() {
        List<BuildingDto> subDivisionDTOList = buildingService.getAll();
        return ResponseEntity.ok(subDivisionDTOList);
    }

    @PostMapping()
    public ResponseEntity<BuildingDto> createBuilding(@Valid @ModelAttribute BuildingCreateDto buildingDTO) {
        BuildingDto buildingDto = buildingService.create(buildingDTO);
        return ResponseEntity.ok(buildingDto);
    }

    @PostMapping("/{id}/documents")
    public ResponseEntity<Void> addDocumentsToMachine(@PathVariable Long id, @RequestParam("files") MultipartFile[] files) {
        buildingService.addPdf(id, files);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<BuildingDto> updateBuilding(@PathVariable Long id, @RequestBody BuildingUpdateDto buildingUpdateDto) {
        BuildingDto buildingDto = buildingService.update(id, buildingUpdateDto);
        return ResponseEntity.ok(buildingDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBuilding(@PathVariable Long id) {
        buildingService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/photos")
    public ResponseEntity<Void> addPhotos(@PathVariable Long id, @RequestParam("photos") MultipartFile[] photos) {
        buildingService.addPhotos(id, photos);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/photos/{id}")
    public ResponseEntity<Void> deletePhoto(@PathVariable UUID id) {
        buildingService.deleteBuildingPhoto(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/other")
    public ResponseEntity<Void> updateOtherText(@PathVariable Long id, @Valid @RequestBody OtherTextDto dto) {
        buildingService.updateOtherText(id, dto.getText());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/other/documents")
    public ResponseEntity<Void> addOtherDocuments(@PathVariable Long id, @RequestParam("files") MultipartFile[] files) {
        buildingService.addOtherDocuments(id, files);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/documents/{id}")
    public ResponseEntity<byte[]> getDocument(@PathVariable UUID id) {
        DocumentFile documentFile = buildingService.getBuildingFile(id);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);

        ContentDisposition disposition = ContentDisposition
                .builder("inline")
                .filename(documentFile.getBaseFileName(), StandardCharsets.UTF_8)
                .build();

        headers.setContentDisposition(disposition);

        return ResponseEntity.ok()
                .headers(headers)
                .body(documentFile.getContent());
    }

    @DeleteMapping("/documents/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable UUID id) {
        buildingService.deleteBuildingFile(id);
        return ResponseEntity.noContent().build();
    }

}
