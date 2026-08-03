package com.example.rces.service.impl;

import com.example.rces.dto.AuthorControlCreateDto;
import com.example.rces.dto.AuthorControlDto;
import com.example.rces.exception.EntityNotFoundExceptionBormash;
import com.example.rces.mapper.AuthorControlMapper;
import com.example.rces.models.AuthorControl;
import com.example.rces.models.enums.NotificationType;
import com.example.rces.repository.AuthorControlRepository;
import com.example.rces.service.AuthorControlService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthorControlServiceImpl implements AuthorControlService {

    private final AuthorControlRepository authorControlRepository;
    private final AuthorControlMapper authorControlMapper;

    @Override
    @Transactional(readOnly = true)
    public AuthorControlDto getAuthorControl(Long id) {

        AuthorControl authorControl = authorControlRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundExceptionBormash("Авторский контроль с ID - " + id + "не найден!", NotificationType.ERROR));

        AuthorControlDto authorControlDto = authorControlMapper.toDto(authorControl);

        return authorControlDto;
    }

    @Override
    @Transactional
    public AuthorControlDto createAuthorControl(AuthorControlCreateDto authorControlCreateDto) {

        AuthorControl authorControl = authorControlRepository.saveAndFlush(
                authorControlMapper.toEntity(authorControlCreateDto)
        );

        authorControl = authorControlRepository.findById(authorControl.getId())
                .orElseThrow(() -> new RuntimeException("AuthorControl not found"));

        return authorControlMapper.toDto(authorControl);

    }

    @Override
    @Transactional
    public AuthorControlDto updateAuthorControl(AuthorControlDto authorControlDto) {

        AuthorControl authorControl = authorControlRepository.findById(authorControlDto.getId())
                .orElseThrow(() -> new EntityNotFoundExceptionBormash("Авторский надзор с ID - " + authorControlDto.getId() + " не найден!", NotificationType.ERROR));

        authorControl = authorControlMapper.toUpdateDto(authorControl, authorControlDto);

        AuthorControlDto updateAuthorControlDto = authorControlMapper.toDto(authorControl);

        return updateAuthorControlDto;
    }

    @Override
    public Page<AuthorControlDto> getAllAuthorControls(Specification<AuthorControl> authorControlSpecification, Pageable pageable) {

        List<AuthorControl> authorControls = authorControlRepository.findAll();
        for (AuthorControl authorControl : authorControls) {
            authorControl.getCreatedDate().atZone(ZoneId.systemDefault()).toLocalDateTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
        }

        Page<AuthorControl> authorControlDtos = authorControlRepository.findAll(authorControlSpecification, pageable);

        Page<AuthorControlDto> authorControlDtoPage = authorControlDtos.map(authorControlMapper::toDto);

        return authorControlDtoPage;
    }

    @Override
    public void deleteAuthorControl(Long id) {
        if (authorControlRepository.existsById(id)) {
            authorControlRepository.deleteById(id);
        } else {
            throw new EntityNotFoundExceptionBormash("Авторский надзор с ID - " + id + " не найден", NotificationType.ERROR);
        }
    }

    @Override
    public AuthorControl getReferenceById(Long id) {
        return authorControlRepository.getReferenceById(id);
    }

    @Override
    public AuthorControl getAuthorControlById(Long id) {
        return authorControlRepository.findById(id).orElseThrow(() -> new EntityNotFoundExceptionBormash("authorControl not found", NotificationType.ERROR));
    }
}
