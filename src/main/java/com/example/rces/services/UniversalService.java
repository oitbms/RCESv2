package com.example.rces.services;

import com.example.rces.controller.payload.ExecutionsPayload;
import com.example.rces.models.*;
import com.example.rces.models.enums.GeneralReason;
import com.example.rces.models.enums.Item;
import com.example.rces.models.enums.MlmNode;
import com.example.rces.models.enums.Status;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static com.example.rces.services.ServiceUtil.colorCalculate;
import static com.example.rces.services.ServiceUtil.saveFiles;

@Service
@Transactional
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

    public <T> List<T> findAll(Class<T> entityClass) {
        return repository.findAll(entityClass);
    }

    public <T> List<T> findAllByField(Class<T> entityClass, String fieldName, Object fieldValue) {
        return repository.findByField(entityClass, fieldName, fieldValue);
    }

    public <T> T findSingleByField(Class<T> entityClass, String fieldName, Object fieldValue) {
        return findAllByField(entityClass, fieldName, fieldValue).get(0);
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

    public SGI createRequestSGI(String workShop, String event, String actions, String department, String note, LocalDate desiredDate, Employee employee) {
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
        sgi.setEmployee(employee);
        sgi.setAgreed(false);

        return repository.save(sgi);
    }

    public FactExecutionSGI createFactExecutionSGI(SGI sgi, ExecutionsPayload payload, MultipartFile[] additionalFiles) {
        FactExecutionSGI factExecutionSGI = new FactExecutionSGI();

        factExecutionSGI.setSgi(sgi);
        sgi.getExecutions().add(factExecutionSGI);
        factExecutionSGI.setExecutionDate(LocalDate.parse(payload.executionDate()));
        factExecutionSGI.setReport(payload.report());

        if (additionalFiles != null) {
            List<Images> images = saveFiles(additionalFiles, factExecutionSGI);
            factExecutionSGI.setImages(images);
        }

        factExecutionSGI = repository.save(factExecutionSGI);
        sgi.setColor(colorCalculate(sgi, LocalDate.now()));
        save(sgi);

        return factExecutionSGI;
    }

    public CustomerOrder createOrGetCustomerOrder(ObjectMapper objectMapper, Employee employee, String customerOrderName, String customerOrderJson) {
        return repository.createOrGetCustomerOrder(objectMapper, employee, customerOrderName, customerOrderJson);
    }

    public void addPhoto(UUID id, MultipartFile[] additionalFiles) {
        repository.addPhoto(id, additionalFiles);
    }

    public void deletePhoto(UUID photoId) {
        repository.deletePhoto(photoId);
    }

    public Employee saveEmployee(Long id,String name, Boolean status, String role, String mlmNode, String password, Long chatID) {
        return repository.saveEmployee(id,name, status, role, mlmNode, password, chatID);
    }

    @Scheduled(cron = "0 5 9 * * *") // каждый день в 09:00
    @Transactional
    public void notifyExpiredDeviations() {
        List<SGI> sgiList = findAll(SGI.class);
    }

}