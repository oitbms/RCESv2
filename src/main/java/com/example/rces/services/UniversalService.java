package com.example.rces.services;

import com.example.rces.models.*;
import com.example.rces.models.enums.GeneralReason;
import com.example.rces.models.enums.MlmNode;
import com.example.rces.models.enums.Status;
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

    public <T> T findById (Class<T> entity, Object id) {
        return repository.findById(entity, id);
    }

    public <T> T save(T entity) {
        return repository.save(entity);
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

    public <T> T findByRequestNumber(Class<T> entityClass, Object requestNumber) {
        return repository.findByRequestNumber(entityClass, requestNumber);
    }

    public Requests createRequest(String type, Employee employee, MlmNode mlmNode, CustomerOrder customerOrder, GeneralReason reason, String comment, MultipartFile[] additionalFiles, Employee createdEmployee) {
        Requests request = new Requests();

        request.setTypeRequest(Requests.type.valueOf(type));
        request.setCreatedBy(createdEmployee);
        request.setCreateDate(LocalDateTime.now());
        request.setRequestNumber(repository.generateRequestNumber());
        request.setEmployee(employee);
        request.setCustomerOrder(customerOrder);
        if (additionalFiles != null) {
            List<Images> images = saveFiles(additionalFiles, request);
            request.setImages(images);
        }
        request.setReason(reason);
        request.setMlmNode(mlmNode);
        request.setComment(comment != null ? comment : "");
        request.setStatus(Status.New);

        return repository.save(request);
    }

    public CustomerOrder createOrGetCustomerOrder(Employee employee, String customerOrderName) {
        return repository.createCustomerOrder(employee, customerOrderName);
    }

    public Employee findEmployeeByChatId(Long chatId) {
        return repository.findEmployeeByChatId(chatId);
    }

}