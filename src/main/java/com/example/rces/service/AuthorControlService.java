package com.example.rces.service;

import com.example.rces.dto.AuthorControlCreateDto;
import com.example.rces.dto.AuthorControlDto;
import com.example.rces.models.AuthorControl;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

public interface AuthorControlService {

    AuthorControlDto getAuthorControl(Long id);

    AuthorControlDto createAuthorControl(AuthorControlCreateDto authorControlCreateDto);

    AuthorControlDto updateAuthorControl(AuthorControlDto authorControlDto);

    Page<AuthorControlDto> getAllAuthorControls(Specification<AuthorControl> authorControlSpecification, Pageable pageable);

    void deleteAuthorControl(Long id);

    AuthorControl getReferenceById(Long id);

    AuthorControl getAuthorControlById(Long id);
}
