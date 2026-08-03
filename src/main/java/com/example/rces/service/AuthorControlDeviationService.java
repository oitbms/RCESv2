package com.example.rces.service;

import com.example.rces.dto.AuthorControlDeviationCreateDto;
import com.example.rces.dto.AuthorControlDeviationDto;
import org.springframework.web.multipart.MultipartFile;

public interface AuthorControlDeviationService {

    AuthorControlDeviationDto getDeviation(Long id);

    AuthorControlDeviationDto createDeviation(AuthorControlDeviationCreateDto authorControlDeviationDto, MultipartFile[] additionalFiles);

    AuthorControlDeviationDto updateDeviation(AuthorControlDeviationDto authorControlDeviationDto);

    void deleteDeviation(Long id);

    AuthorControlDeviationDto addImages(AuthorControlDeviationDto deviationDto, MultipartFile[] additionalFiles);

    AuthorControlDeviationDto updateDate(AuthorControlDeviationDto deviationDto);
}
