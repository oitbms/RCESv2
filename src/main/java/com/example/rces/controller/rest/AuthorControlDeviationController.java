package com.example.rces.controller.rest;


import com.example.rces.dto.AuthorControlDeviationCreateDto;
import com.example.rces.dto.AuthorControlDeviationDto;
import com.example.rces.service.AuthorControlDeviationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/author-control/deviation")
@RequiredArgsConstructor
@Slf4j
public class AuthorControlDeviationController {

    private final AuthorControlDeviationService authorControlDeviationService;

    @GetMapping("/{id}")
    private ResponseEntity<AuthorControlDeviationDto> getAuthorControlDeviation(@PathVariable Long id) {

        log.info("getAuthorControlDeviation");

        AuthorControlDeviationDto deviationDto = authorControlDeviationService.getDeviation(id);

        return ResponseEntity.ok(deviationDto);
    }

    @PostMapping
    private ResponseEntity<AuthorControlDeviationDto> createAuthorControlDeviation(@RequestPart AuthorControlDeviationCreateDto deviationDto,
                                                                                   @RequestPart(value = "additionalFiles", required = false) MultipartFile[] additionalFiles
    ) {

        log.info("createAuthorControlDeviation");

        AuthorControlDeviationDto authorControlDeviationDto = authorControlDeviationService.createDeviation(deviationDto, additionalFiles);

        return ResponseEntity.ok(authorControlDeviationDto);
    }

    @PostMapping("/add-images")
    private ResponseEntity<AuthorControlDeviationDto> addImagesDeviation(@RequestPart AuthorControlDeviationDto deviationDto,
                                                                         @RequestPart(value = "additionalFilesCorrections", required = false) MultipartFile[] additionalFiles) {

        log.info("addImagesDeviation");

        AuthorControlDeviationDto authorControlDeviationDto = authorControlDeviationService.addImages(deviationDto, additionalFiles);

        return ResponseEntity.ok(authorControlDeviationDto);
    }

    @PutMapping
    private ResponseEntity<AuthorControlDeviationDto> updateAuthorControlDeviation(@RequestBody AuthorControlDeviationDto deviationDto) {

        log.info("updateAuthorControlDeviation");

        AuthorControlDeviationDto authorControlDeviationDto = authorControlDeviationService.updateDeviation(deviationDto);

        return ResponseEntity.ok(authorControlDeviationDto);

    }

    @PutMapping("/{id}/update-date")
    private ResponseEntity<AuthorControlDeviationDto> updateDateDeviation(@RequestBody AuthorControlDeviationDto authorControlDeviationDto) {

        log.info("updateDateDeviation");

        AuthorControlDeviationDto updatedDeviation = authorControlDeviationService.updateDate(authorControlDeviationDto);

        return ResponseEntity.ok(updatedDeviation);
    }

    @DeleteMapping("/{id}")
    private ResponseEntity<?> updateAuthorControlDeviation(@PathVariable Long id) {

        log.info("deleteAuthorControlDeviation");

        authorControlDeviationService.deleteDeviation(id);

        return ResponseEntity.noContent().build();

    }

}
