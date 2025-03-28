package com.example.rces.services;

import com.example.rces.models.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

import static com.example.rces.services.ServiceUtil.*;

@Service
public class ApiServices {

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private TelegramService tgService;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    public List<CustomerOrder> findAllCustomerOrder() {
        return entityManager.createQuery("select e from CustomerOrder e", CustomerOrder.class).getResultList();
    }

    public List<Employee> findAllEmployees(String role) {
        return entityManager.createQuery("select e from Employee e where e.role =: role", Employee.class)
                .setParameter("role", role)
                .getResultList();
    }

    public List<Images> findImages(UUID param) {
       List<Images> sasa =  entityManager.createQuery(
                        "select e from Images e " +
                                "where e.constructor.id = :param or e.otk.id = :param or e.technologist.id = :param", Images.class)
                .setParameter("param", param)
                .getResultList();
        return sasa;
    }

    @Transactional
    public void update(Object entityClassName, Object id, Boolean sendMessage, Map<String, Object> updatedFields) {
        try {
            Class<?> entityClass = Class.forName("com.example.rces.models." + entityClassName.toString());
            Object entityId = (id instanceof String) ? UUID.fromString((String) id) : id;
            Object entity = entityManager.find(entityClass, entityId);
            Object oldEntity = deepCopy(entity, entityClass);

            // Получаем все поля, включая унаследованные
            List<Field> fields = getAllDeclaredFields(entityClass);

            updatedFields.forEach((key, value) -> {
                if (!"id".equals(key)) {
                    try {
                        Field field = fields.stream()
                                .filter(f -> f.getName().equals(key))
                                .findFirst()
                                .orElseThrow(() -> new NoSuchFieldException("Поле " + key + " не найдено"));
                        field.setAccessible(true);

                        if (field.getType().isEnum() && value != null) {
                            Class<? extends Enum<?>> enumClass = (Class<? extends Enum<?>>) field.getType();
                            value = enumClass.getMethod("fromField", Object.class).invoke(null, value.toString());
                        } else if (field.getType().isAnnotationPresent(Entity.class) && value != null) {
//                            Object idEntity = field.getType().getAnnotation(Identifier.class).value().equals("UUID.class")
//                                    ? UUID.fromString((String) value)
//                                    : Long.parseLong((String) value);
                            value = objectMapper.readValue((String)value,field.getType());
                        }
                        if (field.getType().isInterface() && value != null) {
                            entityManager.merge(new Images((String) value, entityClassName.toString(), entity));
                            return;
                        }
                        field.set(entity, value);
                    } catch (Exception e) {
                        throw new RuntimeException("Ошибка при обновлении поля " + key, e);
                    }
                }
            });

            entityManager.merge(entity);
            if (sendMessage) {
                if (entity.getClass().getDeclaredMethod("getStatus").invoke(entity)
                        !=
                        entity.getClass().getDeclaredMethod("getStatus").invoke(oldEntity)) {
                    Class<?> clazz = entity.getClass();
                    Employee employee = (Employee) Objects.requireNonNull(getMethod(clazz, entity, "getEmployee"));
                    CustomerOrder customerOrder = (CustomerOrder) Objects.requireNonNull(getMethod(clazz, entity, "getCustomerOrder"));
                    Enum<?> reason = (GeneralReason.Technologist) getMethod(clazz, entity, "getReason");
                    Integer requestNumber = (Integer) getMethod(clazz, entity, "getRequestNumber");
                    String employeeName = (String) employee.getClass().getDeclaredMethod("getName").invoke(employee);
                    String customerOrderName = (String) customerOrder.getClass().getDeclaredMethod("getName").invoke(customerOrder);
                    String comment = (String) getMethod(clazz, entity, "getComment");
                    String reasonName = (String) Objects.requireNonNull(reason).getClass().getDeclaredMethod("getName").invoke(reason);
                    tgService.sendUpdateMessageToGroup(requestNumber, employeeName, customerOrderName, comment, reasonName);
                }
            }
        } catch (ClassNotFoundException e) {
            throw new RuntimeException("Класс не найден: " + entityClassName, e);
        } catch (IllegalAccessException | InvocationTargetException | NoSuchMethodException e) {
            throw new RuntimeException(e);
        }
    }

}
