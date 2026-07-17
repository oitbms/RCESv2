package com.example.rces.controller.rest;

import com.example.rces.dto.AuthorControlCreateDto;
import com.example.rces.dto.AuthorControlDto;
import com.example.rces.service.AuthorControlService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/author-control")
@RequiredArgsConstructor
@Slf4j
public class AuthorRestController {

    private final AuthorControlService authorControlService;

    @GetMapping("/{id}")
    public ResponseEntity<AuthorControlDto> getAuthorControl(@PathVariable Long id) {

        log.info("Getting Author Control with id {}", id);

        AuthorControlDto authorControlDto = authorControlService.getAuthorControl(id);

        log.info("Author Control with id {}", authorControlDto);

        return ResponseEntity.ok(authorControlDto);
    }

    @PostMapping
    public ResponseEntity<AuthorControlDto> createAuthorControl(@RequestBody @Valid AuthorControlCreateDto requestAuthorControlDto) {

        log.info("Creating Author Control {}", requestAuthorControlDto);

        AuthorControlDto authorControlDto = authorControlService.createAuthorControl(requestAuthorControlDto);

        log.info("Author Control with id {}", authorControlDto);

        return ResponseEntity.ok(authorControlDto);
    }

    @PutMapping("/update")
    public ResponseEntity<AuthorControlDto> updateAuthorControl(@RequestBody AuthorControlDto authorControlDto) {

        log.info("Updating Author Control with id {}", authorControlDto);

        AuthorControlDto updatedAuthorControlDto = authorControlService.updateAuthorControl(authorControlDto);

        log.info("Author Control with id {}", updatedAuthorControlDto);

        return ResponseEntity.ok(updatedAuthorControlDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAuthorControl(@PathVariable Long id) {

        log.info("Deleting Author Control with id {}", id);

        authorControlService.deleteAuthorControl(id);

        return ResponseEntity.noContent().build();
    }

}
