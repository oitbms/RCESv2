package com.example.rces.services;

import com.example.rces.models.*;
import com.example.rces.models.enums.GeneralReason;
import com.example.rces.models.enums.Item;
import com.example.rces.models.enums.MlmNode;
import com.example.rces.models.enums.Status;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.NoResultException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static com.example.rces.utils.ServiceUtil.colorCalculate;
import static com.example.rces.utils.ServiceUtil.saveFiles;

@Service
@Transactional(transactionManager = "primaryTransactionManager")
public class UniversalService {
    private final UniversalRepository repository;

    @Autowired
    public UniversalService(UniversalRepository repository) {
        this.repository = repository;
    }

    public <T> T findById(Class<T> entity, Object id) {
        return repository.findById(entity, id);
    }

    public <T> void save(T entity) {
        repository.save(entity);
    }

    public <T> void delete(T entity) {
        repository.delete(entity);
    }

    @Transactional
    public <T> void deleteById(Class<T> entityClass, Object entityId) {
        T entity = repository.findById(entityClass, entityId);
        repository.delete(entity);
    }

    public <T> List<T> findAll(Class<T> entityClass) {
        return repository.findAll(entityClass);
    }

    public <T> List<T> findAllByField(Class<T> entityClass, String fieldName, Object fieldValue) {
        return repository.findByField(entityClass, fieldName, fieldValue);
    }

    public <T> T findSingleByField(Class<T> entityClass, String fieldName, Object fieldValue) {
        return findAllByField(entityClass, fieldName, fieldValue).get(0);
    }

    public <T> Page<T> getPage(Class<T> entityClass, int page, int pageSize, Sort sort, String conditions) {
        return repository.getPageByEntity(entityClass, page, pageSize, sort, conditions);
    }

    public Requests createRequest(String type, Employee employee, MlmNode mlmNode, Item item, Integer qty, CustomerOrder customerOrder, GeneralReason reason, String comment, MultipartFile[] additionalFiles, Employee createdEmployee, String reasonText, String control) {
        Requests request = new Requests();

        request.setTypeRequest(Requests.Type.valueOf(type));
        request.setCreatedBy(createdEmployee);
        request.setCreateDate(LocalDateTime.now());
        request.setRequestNumber(repository.generateRequestNumber(Requests.class));
        request.setEmployee(employee);
        request.setCustomerOrder(customerOrder);
        if (additionalFiles != null) {
            List<Images> images = saveFiles(additionalFiles, request);
            request.setImages(images);
        }
        if (reason != null) {
            request.setReason(reason);
        }
        request.setItem(item);
        request.setQty(qty);
        request.setControl(control);
        request.setMlmNode(mlmNode);
        request.setComment(comment != null ? comment : "");
        request.setStatus(Status.New);
        request.setReason_wr(reasonText);

        return repository.save(request);
    }

    @Transactional
    public SGI createRequestSGI(String workShop, String event, String actions, String department,
                                LocalDate desiredDate, String note, String employee, MultipartFile[] additionalFiles, String parentId) {
        SGI sgi = new SGI();
        sgi.setWorkShop(workShop);
        sgi.setColor(SGI.ColorSGI.NONE);
        sgi.setEvent(event);
        sgi.setActions(actions);
        sgi.setDepartment(SGI.Department.valueOf(department));
        sgi.setNote(note);
        sgi.setDesiredDate(desiredDate);
        sgi.setRequestNumber(repository.generateRequestNumber(SGI.class));
        sgi.setCreateDate(LocalDate.now());
        sgi.setEmployee(repository.findSingleByField(Employee.class, "name", employee));
        sgi.setAgreed(false);
        if (!parentId.isEmpty()) {
            sgi.setParentSGI(repository.findById(SGI.class, UUID.fromString(parentId)));
        }

        if (additionalFiles != null) {
            List<Images> images = saveFiles(additionalFiles, sgi);
            sgi.setImages(images);
        }
        FactExecutionSGI factExecutionSGI = createFactExecutionSGI(sgi);
        sgi.setExecution(factExecutionSGI);
        return repository.save(sgi);
    }

    public FactExecutionSGI createFactExecutionSGI(SGI sgi) {
        FactExecutionSGI factExecutionSGI = new FactExecutionSGI();
        factExecutionSGI.setSgi(sgi);
        return factExecutionSGI;
    }

    public void saveSGI(SGI sgi,
                        String workcenter, String event, String actions, String department, LocalDate desiredDate,
                        String employee, String note, LocalDate planDate, Boolean factExecutionSGIBool, LocalDate executionDate, String report,
                        MultipartFile[] imagesSGI, MultipartFile[] imagesFactSGI) {

        if (!factExecutionSGIBool) {
            try {
                Employee newEmployee = repository.findSingleByField(Employee.class, "name", employee);
                sgi.setEmployee(newEmployee);
            } catch (Exception e) {
                throw new NoResultException();
            }
            sgi.setWorkShop(workcenter);
            sgi.setEvent(event);
            sgi.setActions(actions);
            sgi.setDepartment(SGI.Department.valueOf(department));
            sgi.setDesiredDate(desiredDate);
            sgi.setNote(note);
            sgi.setColor(colorCalculate(sgi, LocalDate.now()));
            if (imagesSGI != null) {
                for (MultipartFile file : imagesSGI) {
                    if (!file.isEmpty()) {
                        Images imageEntity = new Images();
                        imageEntity.setName(file.getOriginalFilename());
                        try {
                            imageEntity.setData(file.getBytes());
                        } catch (IOException e) {
                            throw new RuntimeException(e);
                        }
                        imageEntity.setSgim(sgi);
                        save(imageEntity);
                    }
                }
            }
            repository.save(sgi);
        } else {
            FactExecutionSGI factExecutionSGI = sgi.getExecution();
            factExecutionSGI.setExecutionDate(executionDate);
            factExecutionSGI.setReport(report);
            if (imagesFactSGI != null) {
                for (MultipartFile file : imagesFactSGI) {
                    if (!file.isEmpty()) {
                        Images imageEntity = new Images();
                        imageEntity.setName(file.getOriginalFilename());
                        try {
                            imageEntity.setData(file.getBytes());
                        } catch (IOException e) {
                            throw new RuntimeException(e);
                        }
                        imageEntity.setSgi(factExecutionSGI);
                        save(imageEntity);
                    }
                }
            }
            sgi.setPlanDate(executionDate);
            sgi.setExecution(factExecutionSGI);
            sgi.setColor(colorCalculate(sgi, LocalDate.now()));
            repository.save(sgi);
        }
    }

    public CustomerOrder createOrGetCustomerOrder(ObjectMapper objectMapper, Employee employee, String customerOrderName, String customerOrderJson) {
        return repository.createOrGetCustomerOrder(objectMapper, employee, customerOrderName, customerOrderJson);
    }

    public void deletePhoto(UUID photoId) {
        repository.deletePhoto(photoId);
    }

    public Employee saveEmployee(Long id, String name, String mlmNodeName, Boolean status, String role, String mlmNode, String password, Long chatID) {
        return repository.saveEmployee(id, name, mlmNodeName, status, role, mlmNode, password, chatID);
    }
}