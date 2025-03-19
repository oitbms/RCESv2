package com.example.rces.services;

import com.example.rces.models.CustomerOrder;
import com.example.rces.models.Employee;
import com.example.rces.models.Images;
import com.example.rces.models.enums.Status;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class UniversalService {
    private final UniversalRepository repository;

    public UniversalService(UniversalRepository repository) {
        this.repository = repository;
    }

    public <T> T findById(Class<T> entityClass, Object id) {
        return repository.findById(entityClass, id);
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

    public <T> List<T> findByField(Class<T> entityClass, String fieldName, Object value) {
        return repository.findByField(entityClass, fieldName, value);
    }

    public <T> T findByRequestNumber(Class<T> entityClass, Object requestNumber) {
        return repository.findByRequestNumber(entityClass, requestNumber);
    }

    public <T> T createRequestEntity(Class<T> entityClass, Long employeeId, UUID customerOrderId, Long reasonsId, MultipartFile[] additionalFiles) {
        try {
            T entity = entityClass.getDeclaredConstructor().newInstance();

            Employee employee = repository.findById(Employee.class, employeeId);
            CustomerOrder customerOrder = repository.findById(CustomerOrder.class, customerOrderId);
            Arrays.stream(entity.getClass().getDeclaredMethod("getReason").getReturnType().getEnumConstants())
                    .filter(reason -> {try {return reason.getClass().getDeclaredMethod("getId").invoke(reason).equals(reasonsId);} catch (Exception e) {throw new RuntimeException(e);}})
                    .findFirst()
                    .ifPresent(enym -> {
                        try {
                            entity.getClass().getDeclaredMethod("setReason", enym.getClass()).invoke(entity, enym);
                        } catch (Exception e) {
                            throw new RuntimeException(e);
                        }});

            entity.getClass().getDeclaredMethod("setEmployee", Employee.class).invoke(entity, employee);
            entity.getClass().getDeclaredMethod("setCustomerOrder", CustomerOrder.class).invoke(entity, customerOrder);
            entity.getClass().getDeclaredMethod("setStatus", Status.class).invoke(entity, Status.New);
            if (additionalFiles!=null) {
                List<Images> images = (List<Images>) entity.getClass().getSuperclass()
                        .getDeclaredMethod("saveFiles", MultipartFile[].class)
                        .invoke(entity, (Object) additionalFiles);
                entity.getClass().getDeclaredMethod("setImage", List.class).invoke(entity, images);
            }
            entity.getClass().getSuperclass().getDeclaredMethod("setRequestNumber", Integer.class).invoke(entity, repository.generateRequestNumber(entity.getClass()));
            entity.getClass().getSuperclass().getDeclaredMethod("setCreateDate", LocalDateTime.class).invoke(entity, LocalDateTime.now());

           return repository.save(entity);
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при создании заявки", e);
        }
    }
}