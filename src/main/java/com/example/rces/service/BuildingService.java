package com.example.rces.service;

import com.example.rces.dto.BuildingCreateDto;
import com.example.rces.dto.BuildingDto;
import com.example.rces.dto.BuildingUpdateDto;
import com.example.rces.models.DocumentFile;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface BuildingService {

    BuildingDto create(BuildingCreateDto buildingDto);

    List<BuildingDto> getAll();

    BuildingDto update(Long id, BuildingUpdateDto buildingDto);

    BuildingDto getById(Long id);

    void addPdf(Long id, MultipartFile[] files);

    void delete(Long id);

    void updateOtherText(Long id, String text);

    void addOtherDocuments(Long id, MultipartFile[] files);

    void addPhotos(Long id, MultipartFile[] photos);

    void deleteBuildingPhoto(UUID imageId);

    DocumentFile getBuildingFile(UUID fileId);

    void deleteBuildingFile(UUID fileId);
}
