package com.example.rces.service.impl;

import com.example.rces.dto.BuildingCreateDto;
import com.example.rces.dto.BuildingDto;
import com.example.rces.dto.BuildingUpdateDto;
import com.example.rces.exception.BuildingNotFoundException;
import com.example.rces.exception.EntityNotFoundExceptionBormash;
import com.example.rces.mapper.BuildingMapper;
import com.example.rces.mapper.DocumentFileMapper;
import com.example.rces.mapper.ImagesMapper;
import com.example.rces.models.*;
import com.example.rces.models.enums.NotificationType;
import com.example.rces.repository.BuildingRepository;
import com.example.rces.service.BuildingService;
import com.example.rces.service.DocumentService;
import com.example.rces.service.SubDivisionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

import static com.example.rces.utils.FilesUtil.addPdfFilesToDocument;
import static com.example.rces.utils.FilesUtil.determineFileType;

@Service
@RequiredArgsConstructor
public class BuildingServiceImpl implements BuildingService {

    private final BuildingRepository buildingRepository;
    private final BuildingMapper buildingMapper;
    private final SubDivisionService subDivisionService;
    private final DocumentFileMapper documentFileMapper;
    private final ImagesMapper imagesMapper;
    private final DocumentService documentService;

    @Override
    @Transactional
    public BuildingDto create(BuildingCreateDto buildingDto) {
        checkItemNumberIsFree(buildingDto.getItemNumber(), null);

        Building building = buildingMapper.toEntity(buildingDto);

        SubDivision subDivision = subDivisionService.findById(buildingDto.getSubDivisionId());
        building.setSubdivision(subDivision);

        Document document = new Document();
        document.setName("Документация здания № " + buildingDto.getItemNumber());

        if (buildingDto.getDocumentFiles() != null && buildingDto.getDocumentFiles().length > 0 && !buildingDto.getDocumentFiles()[0].isEmpty()) {
            for (MultipartFile file : buildingDto.getDocumentFiles()) {
                try {

                    DocumentFile documentFile = new DocumentFile();
                    documentFile.setContent(file.getBytes());
                    documentFile.setBaseFileName(file.getOriginalFilename());

                    documentFile.setDocument(document);

                    document.getFiles().add(documentFile);
                } catch (Exception e) {
                    throw new RuntimeException("Document file not found");
                }
            }
        }

        if (buildingDto.getAdditionalFiles() != null && buildingDto.getAdditionalFiles().length > 0 && !buildingDto.getAdditionalFiles()[0].isEmpty()) {
            for (MultipartFile imageFile : buildingDto.getAdditionalFiles()) {
                try {
                    Images newImage = new Images();
                    newImage.setData(imageFile.getBytes());
                    newImage.setName(imageFile.getOriginalFilename());

                    newImage.setDocument(document);

                    document.getImages().add(newImage);
                } catch (IOException e) {
                    throw new RuntimeException("Не удалось обработать файл изображения", e);
                }
            }
        }

        building.setDocument(document);

        buildingRepository.save(building);
        return buildingMapper.toDto(building);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BuildingDto> getAll() {
        List<Building> buildings = buildingRepository.findAll();
        List<BuildingDto> buildingDtoList = buildings.stream()
                .map(buildingMapper::toDto)
                .toList();
        return buildingDtoList;
    }

    @Override
    @Transactional
    public BuildingDto update(Long id, BuildingUpdateDto buildingDto) {
        Building oldBuilding = buildingRepository.findById(id)
                .orElseThrow(() -> new BuildingNotFoundException(id, NotificationType.ERROR));

        if (buildingDto.getItemNumber() != null) {
            checkItemNumberIsFree(buildingDto.getItemNumber(), id);
        }

        Building building = buildingMapper.toUpdateEntity(oldBuilding, buildingDto);

        if (buildingDto.getSubDivisionId() != null) {
            building.setSubdivision(subDivisionService.findById(buildingDto.getSubDivisionId()));
        }

        return buildingMapper.toDto(buildingRepository.save(building));
    }

    @Override
    @Transactional(readOnly = true)
    public BuildingDto getById(Long id) {
        Building building = buildingRepository.findById(id)
                .orElseThrow(() -> new BuildingNotFoundException(id, NotificationType.ERROR));

        BuildingDto buildingDto = buildingMapper.toDto(building);

        buildingDto.setPdfs(building.getDocument().getFiles().stream()
                .filter(Objects::nonNull)
                .map(documentFileMapper::toDTO)
                .toList());

        if (building.getOtherDocument() != null) {
            buildingDto.setOtherPdfs(building.getOtherDocument().getFiles().stream()
                    .filter(Objects::nonNull)
                    .map(documentFileMapper::toDTO)
                    .toList());
        }

        buildingDto.setImageUrls(building.getDocument().getImages()
                .stream()
                .filter(Objects::nonNull)
                .map(imagesMapper::toDTO)
                .toList());

        return buildingDto;
    }

    @Override
    @Transactional
    public void addPdf(Long id, MultipartFile[] files) {
        Building building = buildingRepository.findById(id)
                .orElseThrow(() -> new BuildingNotFoundException(id, NotificationType.ERROR));

        Document document = building.getDocument();

        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;
            try {
                DocumentFile documentFile = new DocumentFile();
                documentFile.setBaseFileName(file.getOriginalFilename());
                documentFile.setContent(file.getBytes());
                documentFile.setDocument(document);
                documentFile.setType(determineFileType(file.getOriginalFilename()));

                document.getFiles().add(documentFile);
            } catch (IOException e) {
                throw new RuntimeException("Document file not found");
            }
        }

        buildingRepository.save(building);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Building building = buildingRepository.findById(id)
                .orElseThrow(() -> new BuildingNotFoundException(id, NotificationType.ERROR));
        buildingRepository.delete(building);
    }

    @Override
    @Transactional(readOnly = true)
    public DocumentFile getBuildingFile(UUID fileId) {
        checkBuildingFile(fileId);
        return documentService.getDocumentFileById(fileId);
    }

    @Override
    @Transactional
    public void deleteBuildingFile(UUID fileId) {
        checkBuildingFile(fileId);
        documentService.deleteFileFromDocument(fileId);
    }

    private void checkBuildingFile(UUID fileId) {
        if (!buildingRepository.existsBuildingFile(fileId)) {
            throw new EntityNotFoundExceptionBormash("Файл здания не найден", NotificationType.ERROR);
        }
    }

    private void checkItemNumberIsFree(int itemNumber, Long buildingId) {
        boolean taken = buildingId == null
                ? buildingRepository.existsByItemNumber(itemNumber)
                : buildingRepository.existsByItemNumberAndIdNot(itemNumber, buildingId);
        if (taken) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Здание с инвентарным номером " + itemNumber + " уже существует");
        }
    }

    @Override
    @Transactional
    public void updateOtherText(Long id, String text) {
        Building building = buildingRepository.findById(id)
                .orElseThrow(() -> new BuildingNotFoundException(id, NotificationType.ERROR));
        building.setOtherText(text == null || text.isBlank() ? null : text.strip());
    }

    @Override
    @Transactional
    public void addOtherDocuments(Long id, MultipartFile[] files) {
        Building building = buildingRepository.findById(id)
                .orElseThrow(() -> new BuildingNotFoundException(id, NotificationType.ERROR));

        Document otherDocument = building.getOtherDocument();
        if (otherDocument == null) {
            otherDocument = new Document();
            otherDocument.setName("Прочее: здание № " + building.getItemNumber());
            building.setOtherDocument(otherDocument);
        }

        addPdfFilesToDocument(otherDocument, files);
        buildingRepository.save(building);
    }
}
