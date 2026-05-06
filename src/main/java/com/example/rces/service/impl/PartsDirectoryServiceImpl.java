package com.example.rces.service.impl;

import com.example.rces.dto.PartsDirectoryCreateDTO;
import com.example.rces.dto.PartsDirectoryCreateDTOFrom1C;
import com.example.rces.dto.PartsDirectoryDTO;
import com.example.rces.mapper.PartsDirectoryMapper;
import com.example.rces.models.CustomerOrder;
import com.example.rces.models.PartsDirectory;
import com.example.rces.dto.PartsDirectoryFrom1C;
import com.example.rces.repository.PartsDirectoryRepository;
import com.example.rces.service.CustomerOrderService;
import com.example.rces.service.EmployeeService;
import com.example.rces.service.PartsDirectoryService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.OptimisticLockException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import static com.example.rces.utils.OneCHelper.*;
import static com.example.rces.utils.ServiceUtil.colorCalculate;
import static io.restassured.RestAssured.given;

@Service
@Transactional(transactionManager = "primaryTransactionManager")
public class PartsDirectoryServiceImpl implements PartsDirectoryService {

    private final PartsDirectoryRepository repository;
    private final PartsDirectoryMapper mapper;
    private final EmployeeService employeeService;
    private final CustomerOrderService customerOrderService;
    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate;

    @Autowired
    public PartsDirectoryServiceImpl(PartsDirectoryRepository repository, PartsDirectoryMapper mapper, EmployeeService employeeService, CustomerOrderService customerOrderService, ObjectMapper objectMapper, RestTemplate restTemplate) {
        this.repository = repository;
        this.mapper = mapper;
        this.employeeService = employeeService;
        this.customerOrderService = customerOrderService;
        this.objectMapper = objectMapper;
        this.restTemplate = restTemplate;
    }

    @Override
    public List<PartsDirectoryDTO> getAllPartsDirectory() {
        return mapper.toDTOList(repository.findAll());
    }

    @Override
    public PartsDirectoryDTO createItem(PartsDirectoryCreateDTO dto) {
        PartsDirectory pdi = mapper.toEntityFromCreateDTO(dto);
        CustomerOrder customerOrder = customerOrderService.createOrGetCustomerOrder(employeeService.getCurrentUser(),
                dto.getCustomerOrder(), null);
        pdi.setCustomerOrder(customerOrder);
        pdi.setStatus(calculateStatus(pdi));
        pdi.setColor(colorCalculate(pdi));
        PartsDirectory savedPdi = repository.save(pdi);
        return mapper.toDTO(savedPdi);
    }

    @Override
    public PartsDirectoryDTO updatePdi(Long id, Long version, Map<String, Object> changes) {
        PartsDirectory pdiEntity = repository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(String.format("PDI с id %s не найдено", id)));
        if (!Objects.equals(pdiEntity.getVersion(), version)) {
            throw new OptimisticLockException("PDI с id " + id + " устарел");
        }
        try {
            objectMapper.readerForUpdating(pdiEntity)
                    .readValue(objectMapper.writeValueAsBytes(changes));
        } catch (Exception e) {
            throw new ApplicationContextException("Ошибка при обновлении PDI", e);
        }
        pdiEntity.setStatus(calculateStatus(pdiEntity));
        pdiEntity.setColor(colorCalculate(pdiEntity));
        repository.save(pdiEntity);
        pdiEntity.setVersion(pdiEntity.getVersion() + 1);
        return mapper.toDTO(pdiEntity);
    }

    private PartsDirectory.Status calculateStatus(PartsDirectory pdi) {
        LocalDate today = LocalDate.now();
        LocalDate requiredUntil = today.plusDays(3);
        boolean program = pdi.getProgram() != null && !pdi.getProgram().isEmpty();

        if (pdi.getReady()) {
            return PartsDirectory.Status.COMPLETE;
        } else if (pdi.getDateCompletion() != null &&
                !pdi.getDateCompletion().toLocalDate().isBefore(today) &&
                !pdi.getDateCompletion().toLocalDate().isAfter(requiredUntil) && program) {
            return PartsDirectory.Status.REQUIRED;
        } else if (program) {
            return PartsDirectory.Status.WORK;
        } else return PartsDirectory.Status.NEW;
    }

    @Override
    public void deletePdi(Long id) {
        repository.deleteById(id);
    }

    @Override
    public PartsDirectoryDTO readyOrNot(Long id, Boolean ready, List<String> operations) {
        PartsDirectory pdiEntity = repository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(String.format("PDI с id %s не найдено", id)));
        if (ready) {
            List<PartsDirectory.Operation> operationList = PartsDirectory.Operation.fromString(operations);
            pdiEntity.setOperation(new ArrayList<>(operationList));
        } else {
            pdiEntity.setOperation(new ArrayList<>());
        }
        pdiEntity.setReady(ready);
        pdiEntity.setStatus(calculateStatus(pdiEntity));
        pdiEntity.setColor(colorCalculate(pdiEntity));
        repository.save(pdiEntity);
        return mapper.toDTO(pdiEntity);
    }

    @Override
    public PartsDirectoryFrom1C downloadFrom1C(String customerOrder) {
        String query = buildCustomerOrderQuery(customerOrder);
        String jsonBody = buildJsonBody(query);

        try {
            String rawResponse = given()
                    .spec(getOneCSpec())
                    .queryParam("ИмяПроцедуры", "ОбработкаДопФункцииДокОбмен")
                    .body(jsonBody)
                    .when()
                    .post()
                    .then()
                    .statusCode(200)
                    .extract()
                    .asString();

            String cleanJson = rawResponse
                    .replace("\uFEFF", "")
                    .replace("﻿", "")
                    .trim();

            return objectMapper.readValue(cleanJson, PartsDirectoryFrom1C.class);
        } catch (Exception e) {
            throw new IllegalStateException("Ошибка 1C", e);
        }
    }

    @Override
    public List<PartsDirectoryDTO> createItemFrom1C(List<PartsDirectoryCreateDTOFrom1C> listDTO) {
        List<PartsDirectory> pdiList = new ArrayList<>();
        listDTO.forEach(dto -> {
            PartsDirectory pdi = new PartsDirectory(dto, employeeService.getCurrentUser());
            CustomerOrder customerOrder = customerOrderService.createOrGetCustomerOrder(employeeService.getCurrentUser(),
                    dto.getCustomerOrder(), null);
            pdi.setCustomerOrder(customerOrder);
            PartsDirectory savedPdi = repository.save(pdi);
            pdiList.add(savedPdi);
        });

        return mapper.toDTOList(pdiList);
    }

    @Scheduled(cron = "0 0 9 * * *")
    @Transactional
    public void notifyExpiredDeviations() {
        List<PartsDirectory> partsDirectories = repository.findAll();
        partsDirectories.forEach(p -> {
            p.setStatus(calculateStatus(p));
            p.setColor(colorCalculate(p));
            repository.save(p);
        });
    }

}
