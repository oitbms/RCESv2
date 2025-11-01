package com.example.rces.service.impl;

import com.example.rces.dto.*;
import com.example.rces.exception.ResourceNotFoundException;
import com.example.rces.mapper.SPEMapper;
import com.example.rces.models.Document;
import com.example.rces.models.SPE;
import com.example.rces.models.enums.StatusSPE;
import com.example.rces.repository.SpeRepository;
import com.example.rces.service.DocumentService;
import com.example.rces.service.ReportService;
import com.example.rces.service.SpeService;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.OptimisticLockException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import static com.example.rces.utils.ServiceUtil.colorCalculate;

@Service
@Transactional(transactionManager = "primaryTransactionManager")
public class SpeServiceImpl implements SpeService {

    private final SpeRepository repository;
    private final DocumentService documentService;
    private final SPEMapper mapper;
    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate;
    private final ReportService reportService;

    @Autowired
    public SpeServiceImpl(SpeRepository repository, DocumentService documentService, SPEMapper mapper, ObjectMapper objectMapper, RestTemplate restTemplate, ReportService reportService) {
        this.repository = repository;
        this.documentService = documentService;
        this.mapper = mapper;
        this.objectMapper = objectMapper;
        this.restTemplate = restTemplate;
        this.reportService = reportService;
    }

    @Override
    public SpeDTO createSPE(SpeFgisCreateDTO dto) {
        String url = "https://fgis.gost.ru/fundmetrology/eapi/vri";
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url)
                .queryParam("mi_number", dto.getOutNumber())
                .queryParam("rows", 100)
                .queryParam("org_title", "ФБУ \"ВОРОНЕЖСКИЙ ЦСМ\"");
//        Optional.ofNullable(dto.getModification())
//                .filter(str -> !str.isBlank())
//                .ifPresent(str -> builder.queryParam("mi_modification", str));
//        Optional.ofNullable(dto.getNotation())
//                .filter(str -> !str.isBlank())
//                .ifPresent(str -> builder.queryParam("mit_notation", str));
        var responseForId = restTemplate.getForObject(builder.toUriString(), JsonNode.class);
        if (responseForId != null && !responseForId.path("result").path("items").isEmpty()) {
            var items = responseForId.path("result").path("items");
            for (JsonNode item : items) {
                var vriId = item.path("vri_id").asText();
                var response = restTemplate.getForObject(url + "/" + vriId, JsonNode.class);
                JsonNode result = Objects.requireNonNull(response).path("result");
                if (!result.path("vriInfo").path("miOwner").asText().equals("Общество с ограниченной ответственностью \"Борисоглебское машиностроение\"")) {
                    continue;
                }

                SpeCreateDTO createDTO = new SpeCreateDTO(result, dto);
                SPE newSpe = mapper.toEntityFromCreateDTO(createDTO);
                Document newDocument = documentService.createDocumentAndAddFile(
                        new DocumentCreateDTO(String.format("Инструмент %s сертификат %s", newSpe.getName(), newSpe.getCertificateNumber())),
                        reportService.createSpeFgisReport(result));
                newSpe.setDocument(newDocument);
                SPE savedSpe = repository.save(newSpe);
                return mapper.toDTO(savedSpe);
            }
            throw new ResourceNotFoundException(String.format("СИ не найдено в реестре ФГИС по параметрам: номер-%s, модификация-%s, обозначение-%s",
                    dto.getOutNumber(), dto.getModification(), dto.getNotation()));
        } else {
            throw new ResourceNotFoundException(String.format("СИ не найдено в реестре ФГИС по параметрам: номер-%s, модификация-%s, обозначение-%s",
                    dto.getOutNumber(), dto.getModification(), dto.getNotation()));
        }
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
        if (speEntity.getMark() != null) {
            switch (speEntity.getMark()) {
                case "исправен" -> speEntity.setStatus(StatusSPE.CORRECTED);
                case "списан" -> speEntity.setStatus(StatusSPE.WRITE_OFF);
                case "на поверке" -> speEntity.setStatus(StatusSPE.AT_INSPECTION);
                case "ремонт" -> speEntity.setStatus(StatusSPE.REPAIR);
            }
        }
        speEntity.setStatus(calculateStatus(speEntity));
        speEntity.setColor(colorCalculate(speEntity));
        if (speEntity.getStatus() == StatusSPE.EXPIRED || speEntity.getStatus() == StatusSPE.VERIFICATION_REQUIRED) {
            speEntity.setMark(null);
        }
        repository.save(speEntity);
        speEntity.setVersion(speEntity.getVersion() + 1);
        return mapper.toDTO(speEntity);
    }

    @Override
    public void deleteSpe(Integer number) {
        SPE spe = repository.findById(number).orElseThrow(() -> new EntityNotFoundException("SPE не найден"));
        if (spe.getDocument() != null) {
            documentService.deleteDocument(spe.getDocument().getId());
        }
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

    @Override
    public void calculateDateVerification() {
        List<SPE> speList = repository.findAll();
        speList.forEach(spe -> {
            spe.setStatus(calculateStatus(spe));
            if (spe.getStatus() == StatusSPE.EXPIRED || spe.getStatus() == StatusSPE.VERIFICATION_REQUIRED) {
                spe.setMark(null);
            }
            spe.setColor(colorCalculate(spe));
            repository.save(spe);
        });
    }

    @Scheduled(cron = "0 0 9 * * *")
    @Transactional
    public void notifyExpiredDeviations() {
        calculateDateVerification();
    }

    private StatusSPE calculateStatus(SPE spe) {
        StatusSPE currentStatus = spe.getStatus();
        if (currentStatus == StatusSPE.WRITE_OFF || currentStatus == StatusSPE.AT_INSPECTION || currentStatus == StatusSPE.REPAIR) {
            return currentStatus;
        } else if (LocalDate.now().isAfter(spe.getDateVerification())) {
            return StatusSPE.EXPIRED;
        } else if (ChronoUnit.MONTHS.between(LocalDate.now(), spe.getDateVerification()) == 0 ||
                ChronoUnit.MONTHS.between(LocalDate.now(), spe.getDateVerification()) == 1) {
            return StatusSPE.VERIFICATION_REQUIRED;
        } else {
            return currentStatus;
        }
    }

}
