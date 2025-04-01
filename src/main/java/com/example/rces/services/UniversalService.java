package com.example.rces.services;

import com.example.rces.models.CustomerOrder;
import com.example.rces.models.Employee;
import com.example.rces.models.Images;
import com.example.rces.models.enums.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

import static com.example.rces.services.ServiceUtil.saveFiles;

@Service
@Transactional
public class UniversalService {
    private final UniversalRepository repository;

    @Autowired
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

    public <T> T findByRequestNumber(Class<T> entityClass, Object requestNumber) {
        return repository.findByRequestNumber(entityClass, requestNumber);
    }

    public <T> T createRequestEntity(Class<T> entityClass, Employee employee, CustomerOrder customerOrder, Enum<?> reason, String itemName, String comment, MultipartFile[] additionalFiles) {
        try {
            T entity = entityClass.getDeclaredConstructor().newInstance();

            entity.getClass().getDeclaredMethod("setEmployee", Employee.class).invoke(entity, employee);
            entity.getClass().getDeclaredMethod("setCustomerOrder", CustomerOrder.class).invoke(entity, customerOrder);
            if (reason != null) {
                entity.getClass().getDeclaredMethod("setReason", reason.getClass()).invoke(entity, reason);
            }
            if (itemName != null) {
                entity.getClass().getDeclaredMethod("setItemName", String.class).invoke(entity, itemName);
            }
            entity.getClass().getDeclaredMethod("setStatus", Status.class).invoke(entity, Status.New);
            if (additionalFiles != null) {
                List<Images> images = saveFiles(additionalFiles, entity);
                entity.getClass().getDeclaredMethod("setImage", List.class).invoke(entity, images);
            }
            entity.getClass().getSuperclass().getDeclaredMethod("setComment", String.class).invoke(entity, !Objects.equals(comment, "") ? comment.substring(0, comment.length() - 1) : "");
            entity.getClass().getSuperclass().getDeclaredMethod("setRequestNumber", Integer.class).invoke(entity, repository.generateRequestNumber(entity.getClass()));
            entity.getClass().getSuperclass().getDeclaredMethod("setCreateDate", LocalDateTime.class).invoke(entity, LocalDateTime.now());

            return repository.save(entity);
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при создании заявки", e);
        }
    }

    public CustomerOrder getOrCreateCustomerOrder(String name) {
        CustomerOrder customerOrder = repository.findByName(CustomerOrder.class, name);
        if (customerOrder != null) {
            return customerOrder;
        } else {
            customerOrder = new CustomerOrder();
            customerOrder.setName(name);
            return repository.save(customerOrder);
        }
    }

    public List<Employee> getEmployeesByRole(String role) {
        return repository.findByRole(Employee.class, role);
    }

    public Employee findEmployeeByChatId(Long chatId) {return repository.findEmployeeByChatId(chatId);}

}