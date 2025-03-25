package com.example.rces.services;

import com.example.rces.controller.payload.ImagesPayload;
import com.example.rces.models.CustomerOrder;
import com.example.rces.models.Employee;
import com.example.rces.models.GeneralReason;
import com.example.rces.models.Images;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Field;
import java.util.*;
import java.util.stream.Collectors;

import static com.example.rces.services.ServiceUtil.*;

@Service
public class ApiServices {

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private TelegramService tgService;

    @Autowired
    private ObjectMapper objectMapper;

    public List<CustomerOrder> findAllCustomerOrder() {
        return entityManager.createQuery("select e from CustomerOrder e", CustomerOrder.class).getResultList();
    }

    public List<Employee> findAllEmployees(String role) {
        return entityManager.createQuery("select e from Employee e where e.role =: role", Employee.class)
                .setParameter("role", role)
                .getResultList();
    }

    public List<ImagesPayload> findImages(UUID param) {
        List<Images> images = entityManager.createQuery(
                        "select e from Images e " +
                                "where e.constructor.id = :param or e.otk.id = :param or e.technologist.id = :param", Images.class)
                .setParameter("param", param)
                .getResultList();
        return images.stream()
                .map(image -> new ImagesPayload(
                        image.getId(),
                        image.getFileName(),
                        image.getBase64Data(),
                        image.getConstructor() != null ? image.getConstructor().getId()
                                : image.getTechnologist() != null ? image.getTechnologist().getId() : image.getOtk().getId()
                ))
                .collect(Collectors.toList());
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
                            value = objectMapper.readValue((String) value, field.getType());
                        }
                        if (field.getType().isInterface() && value != null) {
                            if (!((ArrayList<?>) value).isEmpty()) {
                                List<UUID> imageIds = ((ArrayList<?>) value).stream()
                                        .filter(LinkedHashMap.class::isInstance)
                                        .map(img -> UUID.fromString((String)((LinkedHashMap<?,?>) img).get("id")))
                                        .toList();
                                List<Images> images = entityManager.createQuery(
                                                "SELECT i FROM Images i WHERE i.id IN :ids", Images.class)
                                        .setParameter("ids", imageIds)
                                        .getResultList();
                                ((ArrayList<?>) value).stream()
                                        .filter(String.class::isInstance)
                                        .map(String.class::cast)
                                        .forEach(imgStr -> {
                                            Images newImage = new Images(imgStr, entityClassName.toString(), entity);
                                            images.add(newImage);
                                            entityManager.persist(newImage);
                                        });
                                handleImageCollection(entity, field, images);
                                return;
                            }
                            handleImageCollection(entity, field, (List<?>) value);
                            return;
                        }
                        field.set(entity, value);
                    } catch (Exception e) {
                        throw new RuntimeException("Ошибка при обновлении поля " + key, e);
                    }
                }
            });
            if (sendMessage) {
                if (entity.getClass().getDeclaredMethod("getStatus").invoke(entity)
                        !=
                        entity.getClass().getDeclaredMethod("getStatus").invoke(oldEntity)) {
                    Class<?> clazz = entity.getClass();
                    Employee employee = (Employee) Objects.requireNonNull(getGetterMethod(clazz, entity, "getEmployee"));
                    CustomerOrder customerOrder = (CustomerOrder) Objects.requireNonNull(getGetterMethod(clazz, entity, "getCustomerOrder"));
                    Enum<?> reason = (GeneralReason.Technologist) getGetterMethod(clazz, entity, "getReason");
                    Integer requestNumber = (Integer) getGetterMethod(clazz, entity, "getRequestNumber");
                    String employeeName = (String) employee.getClass().getDeclaredMethod("getName").invoke(employee);
                    String customerOrderName = (String) customerOrder.getClass().getDeclaredMethod("getName").invoke(customerOrder);
                    String comment = (String) getGetterMethod(clazz, entity, "getComment");
                    String reasonName = (String) Objects.requireNonNull(reason).getClass().getDeclaredMethod("getName").invoke(reason);
                    tgService.sendUpdateMessageToGroup(requestNumber, employeeName, customerOrderName, comment, reasonName);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
