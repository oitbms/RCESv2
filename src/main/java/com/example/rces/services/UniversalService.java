package com.example.rces.services;

import com.example.rces.models.CustomerOrder;
import com.example.rces.models.Employee;
import com.example.rces.models.Images;
import com.example.rces.models.Requests;
import com.example.rces.models.enums.GeneralReason;
import com.example.rces.models.enums.Item;
import com.example.rces.models.enums.MlmNode;
import com.example.rces.models.enums.Status;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

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

    public Requests createRequest(String type, Employee employee, MlmNode mlmNode, Item item, Integer qty, CustomerOrder customerOrder, GeneralReason reason, String comment, MultipartFile[] additionalFiles, Employee createdEmployee,String reasonText) {
        Requests request = new Requests();

        request.setTypeRequest(Requests.Type.valueOf(type));
        request.setCreatedBy(createdEmployee);
        request.setCreateDate(LocalDateTime.now());
        request.setRequestNumber(repository.generateRequestNumber());
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
        request.setMlmNode(mlmNode);
        request.setComment(comment != null ? comment : "");
        request.setStatus(Status.New);
        if (reasonText != null) {
            request.setReason_wr(reasonText);
        }
        return repository.save(request);
    }

    public CustomerOrder createOrGetCustomerOrder(ObjectMapper objectMapper, Employee employee, String customerOrderName, String customerOrderJson) {
        return repository.createOrGetCustomerOrder(objectMapper, employee, customerOrderName, customerOrderJson);
    }

}