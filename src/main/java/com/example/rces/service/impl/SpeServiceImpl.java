package com.example.rces.service.impl;

import com.example.rces.dto.DocumentCreateDTO;
import com.example.rces.dto.DocumentDTO;
import com.example.rces.dto.SpeCreateDTO;
import com.example.rces.dto.SpeDTO;
import com.example.rces.mapper.SPEMapper;
import com.example.rces.models.Document;
import com.example.rces.models.SPE;
import com.example.rces.models.enums.StatusSPE;
import com.example.rces.repository.SpeRepository;
import com.example.rces.service.DocumentService;
import com.example.rces.service.SpeService;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.OptimisticLockException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import static com.example.rces.utils.ServiceUtil.colorCalculate;

@Service
@Transactional(transactionManager = "primaryTransactionManager")
public class SpeServiceImpl implements SpeService {

    private final SpeRepository repository;
    private final DocumentService documentService;
    private final SPEMapper mapper;
    private final ObjectMapper objectMapper;

    @Autowired
    public SpeServiceImpl(SpeRepository repository, DocumentService documentService, SPEMapper mapper, ObjectMapper objectMapper) {
        this.repository = repository;
        this.documentService = documentService;
        this.mapper = mapper;
        this.objectMapper = objectMapper;
    }

    @Override
    public SpeDTO createSPE(SpeCreateDTO dto) {
        SPE newSPE = mapper.toEntityFromCreateDTO(dto);
        SPE savedSpe = repository.save(newSPE);
        return mapper.toDTO(savedSpe);
    }

    @Override
    public List<SpeDTO> getAllSPE() {
        var allSPE = repository.findAll();
        return allSPE.stream().map(mapper::toDTO).toList();
    }

    @Override
    public SpeDTO updateSPE(Integer number, Long version, Map<String, Object> changes) {
        SPE speEntity = repository.findById(number).orElseThrow(
                () -> new EntityNotFoundException(String.format("Spe с id %s не найдено", number)));
        if (!Objects.equals(speEntity.getVersion(), version)) {
            throw new OptimisticLockException("SPE с id " + number + " устарел");
        }
        try {
            objectMapper.updateValue(speEntity, changes);
        } catch (JsonMappingException e) {
            throw new ApplicationContextException("Ошибка при обновлении SPE", e);
        }
        switch (speEntity.getMark()) {
            case "списан" -> speEntity.setStatus(StatusSPE.WRITE_OFF);
            case "на поверке" -> speEntity.setStatus(StatusSPE.AT_INSPECTION);
        }
        speEntity.setColor(colorCalculate(speEntity));
        repository.save(speEntity);
        return mapper.toDTO(speEntity);
    }

    @Override
    public void deleteSpe(Integer number) {
        repository.deleteById(number);
    }

    @Override
    public List<SPE> findAllByIdList(List<Integer> ids) {
        return repository.findAllById(ids);
    }

    @Override
    public DocumentDTO createSpeDocument(Integer number, DocumentCreateDTO dto) {
        SPE spe = repository.findById(number).orElseThrow(() -> new EntityNotFoundException("SPE не найден"));
        dto.setName(String.format("Инструмент %s сертификат %s", spe.getName(), spe.getCertificateNumber()));
        Document document = documentService.createDocument(dto);
        spe.setDocument(document);
        repository.save(spe);
        return documentService.toDTO(document);
    }

    @Scheduled(cron = "0 0 9 * * *")
    @Transactional
    public void notifyExpiredDeviations() {
        List<SPE> sgiList = repository.findAll();
        sgiList.stream().parallel().forEach(spe -> {
            spe.setStatus(calculateStatus(spe));
            repository.save(spe);
        });
    }

    private StatusSPE calculateStatus(SPE spe) {
        StatusSPE currentStatus = spe.getStatus();
        if (currentStatus == StatusSPE.WRITE_OFF || currentStatus == StatusSPE.AT_INSPECTION) {
            return currentStatus;
        }
        else if (ChronoUnit.MONTHS.between(spe.getDatePreparation(), spe.getDateVerification()) == 0) {
            return StatusSPE.VERIFICATION_REQUIRED;
        }
        else if (Math.abs(ChronoUnit.MONTHS.between(spe.getDatePreparation(), spe.getDateVerification())) < 1){
            return StatusSPE.EXPIRED;
        }
        else {
            return currentStatus;
        }
    }

}
