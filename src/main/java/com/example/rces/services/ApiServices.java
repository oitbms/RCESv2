package com.example.rces.services;

import com.example.rces.models.CustomerOrder;
import com.example.rces.models.Employee;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

@Service
public class ApiServices {

    @PersistenceContext
    private EntityManager entityManager;

    public List<CustomerOrder> findAllCustomerOrder() {
        return entityManager.createQuery("select e from CustomerOrder e", CustomerOrder.class).getResultList();
    }

    public List<Employee> findAllEmployees(String role) {
        return entityManager.createQuery("select e from Employee e where e.role =: role", Employee.class)
                .setParameter("role", role)
                .getResultList();
    }

    @Transactional
    public void update(String entityClassName, Object id, Map<String, Object> updatedFields) {
        try {
            Class<?> entityClass = Class.forName("com.example.rces.models." + entityClassName);
            Object entityId = (id instanceof String) ? UUID.fromString((String) id) : id;
            Object entity = entityManager.find(entityClass, entityId);
            updatedFields.forEach((key, value) -> {
                try {
                    if (!Objects.equals(key, "id")) {
                        Field field = entityClass.getDeclaredField(key);
                        field.setAccessible(true);
                        if (field.getType().isEnum()) {
                            Class<? extends Enum<?>> enumClass = (Class<? extends Enum<?>>) field.getType();
                            value = enumClass.getMethod("fromString", String.class).invoke(null, value.toString());
                            field.set(entity, value);
                        } else {
                            field.set(entity, value);
                        }
                    }
                } catch (NoSuchFieldException | IllegalAccessException e) {
                    throw new RuntimeException("Ошибка при обновлении поля " + key, e);
                } catch (NoSuchMethodException | InvocationTargetException e) {
                    throw new RuntimeException(e);
                }
            });
            entityManager.merge(entity);
        } catch (ClassNotFoundException e) {
            throw new RuntimeException(e);
        }
    }

}
