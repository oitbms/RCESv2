package com.example.rces.service.impl;

import com.example.rces.dto.InspectionCreateDTO;
import com.example.rces.dto.InspectionDTO;
import com.example.rces.dto.InspectionViolationCreateDTO;
import com.example.rces.dto.InspectionViolationDTO;
import com.example.rces.exception.EntityNotFoundExceptionBormash;
import com.example.rces.exception.ForbiddenExceptionBormash;
import com.example.rces.mapper.InspectionMapper;
import com.example.rces.mapper.InspectionViolationMapper;
import com.example.rces.models.Inspection;
import com.example.rces.models.InspectionViolation;
import com.example.rces.models.enums.NotificationType;
import com.example.rces.repository.InspectionRepository;
import com.example.rces.repository.InspectionViolationRepository;
import com.example.rces.service.ImageService;
import com.example.rces.service.InspectionService;
import com.example.rces.service.SubDivisionService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.ws.rs.ForbiddenException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@Transactional(transactionManager = "primaryTransactionManager")
public class InspectionServiceImpl implements InspectionService {

    private final SubDivisionService subDivisionService;
    private final InspectionMapper inspectionMapper;
    private final InspectionViolationMapper inspectionViolationMapper;
    private final ImageService imageService;
    private final InspectionRepository inspectionRepository;
    private final InspectionViolationRepository inspectionViolationRepository;

    @Autowired
    public InspectionServiceImpl(SubDivisionService subDivisionService, InspectionMapper mapper, InspectionViolationMapper inspectionViolationMapper, ImageService imageService, InspectionRepository inspectionRepository, InspectionViolationRepository inspectionViolationRepository) {
        this.subDivisionService = subDivisionService;
        this.inspectionMapper = mapper;
        this.inspectionViolationMapper = inspectionViolationMapper;
        this.imageService = imageService;
        this.inspectionRepository = inspectionRepository;
        this.inspectionViolationRepository = inspectionViolationRepository;
    }

    @Override
    public List<InspectionDTO> getAllInspection() {
        return inspectionRepository.findAll()
                .stream()
                .map(inspectionMapper::toDTO)
                .toList();
    }

    @Override
    public List<InspectionViolationDTO> getViolationsForInspectionId(Integer id) {
        return inspectionViolationMapper.toDTOList(inspectionViolationRepository.findAllByInspectionId(id));
    }

    @Override
    public InspectionDTO createInspection(InspectionCreateDTO dto) {
        if (inspectionRepository.existsThisMonth(dto.getSubDivision())) {
            throw new ForbiddenExceptionBormash("Вы уже создали инспекцию за этот месяц", NotificationType.WARNING);
        }
        Inspection newInspection = new Inspection();
        newInspection.setDateInspection(LocalDateTime.now());
        newInspection.setSubDivision(subDivisionService.getByCode(dto.getSubDivision()));
        newInspection.setType(Inspection.TypeInspection.primary);
        Inspection saveInspection = inspectionRepository.save(newInspection);
        return inspectionMapper.toDTO(saveInspection);
    }

    @Override
    public InspectionDTO createSecondaryInspection(Integer inspectionId) {
        Inspection primaryInspection = inspectionRepository.findById(inspectionId)
                .orElseThrow(() -> new EntityNotFoundException("Инспекции с id " + inspectionId + " не существует"));
        if (primaryInspection.getHaveSecondInspection() || Objects.equals(primaryInspection.getType(), Inspection.TypeInspection.secondary.getName())) {
            throw new ForbiddenExceptionBormash("Уже есть повторная инспекция", NotificationType.WARNING);
        }
        if (primaryInspection.getViolation().isEmpty()) {
            throw new ForbiddenExceptionBormash("В первичной инспекции нет нарушений", NotificationType.WARNING);
        }

        Inspection secondaryInspection = new Inspection();
        secondaryInspection.setSubDivision(primaryInspection.getSubDivision());
        secondaryInspection.setDateInspection(LocalDateTime.now());
        secondaryInspection.setType(Inspection.TypeInspection.secondary);
        secondaryInspection.setHaveSecondInspection(false);

        List<InspectionViolation> secondaryViolations = new ArrayList<>();
        if (primaryInspection.getViolation() != null) {
            for (InspectionViolation originalViolation : primaryInspection.getViolation()) {
                InspectionViolation copiedViolation = new InspectionViolation();

                copiedViolation.setDescription(originalViolation.getDescription());
                copiedViolation.setCriteria(originalViolation.getCriteriaInspection());
                copiedViolation.setScore(originalViolation.getScore() + 1);
                copiedViolation.setSubDivision(originalViolation.getSubDivision());
                copiedViolation.setStatus(originalViolation.getStatusInspection());
                copiedViolation.setInspection(secondaryInspection);

                secondaryViolations.add(copiedViolation);
            }
        }
        secondaryInspection.setViolation(secondaryViolations);

        Inspection savedSecondary = inspectionRepository.save(secondaryInspection);

        savedSecondary.setPrimaryInspection(primaryInspection);
        primaryInspection.setHaveSecondInspection(true);

        inspectionRepository.save(primaryInspection);
        inspectionRepository.save(savedSecondary);

        return inspectionMapper.toDTO(savedSecondary);
    }

    @Override
    public InspectionViolationDTO createViolation(InspectionViolationCreateDTO dto, MultipartFile[] additionalFiles) {
        InspectionViolation newViolation = new InspectionViolation();
        newViolation.setInspection(inspectionRepository.findById(dto.getInspectionId())
                .orElseThrow(() -> new EntityNotFoundException("Инспекции с id" + dto.getInspectionId() + "не существует")));
        newViolation.setCriteria(InspectionViolation.CriteriaInspection.getByName(dto.getCriteria()));
        newViolation.setStatus(InspectionViolation.StatusInspection.status1);
        newViolation.setDescription(dto.getDescription());
        newViolation.setScore(dto.getScore());
        newViolation.setSubDivision(subDivisionService.getByName(dto.getSubDivision()));
        if (additionalFiles != null) {
            newViolation.setImages(imageService.createImages(additionalFiles, newViolation, false));
        }
        InspectionViolation savedViolation = inspectionViolationRepository.save(newViolation);

        return inspectionViolationMapper.toDTO(savedViolation);
    }

    @Override
    public void changeStatus(UUID id) {
        InspectionViolation violation = inspectionViolationRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Нарушения с id" + id + "не существует"));
        violation.setStatus(violation.getStatus().equals(InspectionViolation.StatusInspection.status1.getName()) ? InspectionViolation.StatusInspection.status2 : InspectionViolation.StatusInspection.status1);
        inspectionViolationRepository.save(violation);
        inspectionViolationMapper.toDTO(violation);
    }

    @Override
    @Transactional
    public void deleteInspection(Integer id) {
        Inspection inspection = inspectionRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundExceptionBormash("Инспекции с id " + id + " не существует", NotificationType.ERROR));
        if (inspection.getHaveSecondInspection()) {
            throw new ForbiddenException("Нельзя удалить основную инспекцию если есть вторичная");
        }
        Inspection primaryInspection = inspection.getPrimaryInspection();

        if (primaryInspection != null) {
            primaryInspection.setHaveSecondInspection(false);
            inspectionRepository.save(primaryInspection);
        }
        inspectionRepository.delete(inspection);
    }

    @Override
    public void deleteInspectionViolation(UUID id) {
        InspectionViolation violation = inspectionViolationRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundExceptionBormash("Нарушения с id" + id + "не существует", NotificationType.ERROR));
        inspectionViolationRepository.delete(violation);
    }

}
