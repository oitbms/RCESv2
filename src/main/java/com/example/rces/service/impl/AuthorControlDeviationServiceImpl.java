package com.example.rces.service.impl;

import com.example.rces.dto.AuthorControlDeviationCreateDto;
import com.example.rces.dto.AuthorControlDeviationDto;
import com.example.rces.exception.EntityNotFoundExceptionBormash;
import com.example.rces.mapper.AuthorControlDeviationMapper;
import com.example.rces.models.AuthorControlDeviation;
import com.example.rces.models.enums.NotificationType;
import com.example.rces.repository.AuthorControlDeviationRepository;
import com.example.rces.service.AuthorControlDeviationService;
import com.example.rces.service.AuthorControlService;
import com.example.rces.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class AuthorControlDeviationServiceImpl implements AuthorControlDeviationService {

    private final AuthorControlDeviationRepository authorControlDeviationRepository;
    private final AuthorControlDeviationMapper authorControlDeviationMapper;
    private final ImageService imageService;
    private final AuthorControlService authorControlService;

    @Override
    @Transactional(readOnly = true)
    public AuthorControlDeviationDto getDeviation(Long id) {

        AuthorControlDeviation authorControlDeviation = authorControlDeviationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundExceptionBormash("Deviation not found", NotificationType.ERROR));

        AuthorControlDeviationDto dto = authorControlDeviationMapper.toDto(authorControlDeviation);

        return dto;
    }

    @Override
    @Transactional
    public AuthorControlDeviationDto createDeviation(AuthorControlDeviationCreateDto authorControlDeviationDto, MultipartFile[] additionalFiles) {

        AuthorControlDeviation deviation = authorControlDeviationMapper.toEntity(authorControlDeviationDto);

        deviation.setAuthorControl(authorControlService.getAuthorControlById(authorControlDeviationDto.getAuthorControl().getId()));

        deviation.setDeviationNumber(deviation.getAuthorControl().getAuthorControlDeviations().size() + 1);

        AuthorControlDeviation newDeviation = authorControlDeviationRepository.saveAndFlush(deviation);

        deviation = authorControlDeviationRepository.findById(newDeviation.getId())
                .orElseThrow(() -> new RuntimeException("AuthorControl not found"));

        if (additionalFiles != null && additionalFiles.length > 0) {
            imageService.createImage(additionalFiles, deviation, true);
        }

        return authorControlDeviationMapper.toDto(deviation);
    }

    @Override
    @Transactional
    public AuthorControlDeviationDto updateDeviation(AuthorControlDeviationDto authorControlDeviationDto) {

        AuthorControlDeviation deviation = authorControlDeviationRepository.findById(authorControlDeviationDto.getId()).orElseThrow(() -> new EntityNotFoundExceptionBormash("Deviation not found", NotificationType.ERROR));

        AuthorControlDeviation updateDeviation = authorControlDeviationMapper.toUpdateEntity(deviation,authorControlDeviationDto);

        return authorControlDeviationMapper.toDto(updateDeviation);
    }

    @Override
    @Transactional
    public void deleteDeviation(Long id) {
        authorControlDeviationRepository.deleteById(id);
    }

    @Override
    @Transactional
    public AuthorControlDeviationDto addImages(AuthorControlDeviationDto authorControlDeviationDto, MultipartFile[] additionalFiles) {

        AuthorControlDeviation deviation = authorControlDeviationRepository.findById(authorControlDeviationDto.getId())
                .orElseThrow(() -> new EntityNotFoundExceptionBormash("Deviation not found", NotificationType.ERROR));

        if (additionalFiles != null && additionalFiles.length > 0) {
            imageService.createImageCorrections(additionalFiles, deviation, true);
        }

        return authorControlDeviationMapper.toDto(deviation);
    }

    @Override
    @Transactional
    public AuthorControlDeviationDto updateDate(AuthorControlDeviationDto authorControlDeviationDto) {

        AuthorControlDeviation deviation = authorControlDeviationRepository.findById(authorControlDeviationDto.getId())
                .orElseThrow(() -> new EntityNotFoundExceptionBormash("Deviation not found", NotificationType.ERROR));

        return authorControlDeviationMapper.toDto(authorControlDeviationMapper.toUpdateEntity(deviation,authorControlDeviationDto));
    }

}
