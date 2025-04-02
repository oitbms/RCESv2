package com.example.rces.services;

import com.example.rces.controller.payload.ImagesPayload;
import com.example.rces.models.CustomerOrder;
import com.example.rces.models.Employee;
import com.example.rces.models.Images;
import com.example.rces.models.Requests;
import com.example.rces.models.enums.Status;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.Entity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Field;
import java.util.*;
import java.util.stream.Collectors;

import static com.example.rces.services.ServiceUtil.handleImageCollection;
import static com.example.rces.services.ServiceUtil.isJson;

@Service
public class ApiServices {

    @Autowired
    private UniversalService service;

    @Autowired
    private TelegramService tgService;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    public List<CustomerOrder> findAllCustomerOrder() {
        return service.findAll(CustomerOrder.class);
    }

    public List<Employee> findAllEmployees(String role) {
        return service.findAllByField(Employee.class, "role", role);
    }

    public List<ImagesPayload> findImages(UUID param) {
        List<Images> images = service.findAllByField(Images.class, "request.id", param);
        return images.stream()
                .map(image -> new ImagesPayload(
                        image.getId(),
                        image.getFileName(),
                        image.getBase64Data(),
                        image.getRequest().getId()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public void update(String bidType, UUID id, Boolean sendMessage, Map<String, Object> updatedFields) {
        Requests request = service.findById(Requests.class, id);
        Requests oldRequest = null;
        try {
            oldRequest = (Requests) request.clone();
        } catch (CloneNotSupportedException e) {
            throw new RuntimeException(e);
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Employee updaterEmployee = userDetailsService.loadUserByUsername(authentication.getName());

        List<Field> fields = List.of(request.getClass().getDeclaredFields());

        updatedFields.forEach((key, value) -> {
            if (!"id".equals(key)) {
                try {
                    Field field = fields.stream()
                            .filter(f -> f.getName().equals(key))
                            .findFirst()
                            .orElseThrow(() -> new NoSuchFieldException("Поле " + key + " не найдено"));
                    field.setAccessible(true);
                    if (key.equals("customerOrder") && !isJson(value)) {

                        CustomerOrder customerOrder = service.createCustomerOrder(updaterEmployee, value.toString());
                        field.set(request, customerOrder);
                        return;
                    }

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
                                    .map(img -> UUID.fromString((String) ((LinkedHashMap<?, ?>) img).get("id")))
                                    .toList();
                            List<Images> images = service.findAllByField(Images.class, "id", imageIds);
                            ((ArrayList<?>) value).stream()
                                    .filter(String.class::isInstance)
                                    .map(String.class::cast)
                                    .forEach(imgStr -> {
                                        Images newImage = new Images(imgStr, request);
                                        images.add(newImage);
                                        service.save(images);
                                    });
                            handleImageCollection(request, images);
                            return;
                        }
                        handleImageCollection(request, (List<?>) value);
                        return;
                    }
                    field.set(request, value);
                } catch (Exception e) {
                    throw new RuntimeException("Ошибка при обновлении поля " + key, e);
                }
            }
        });

        request.setUpdateBy(updaterEmployee);
        service.save(request);

        if (sendMessage || request.getStatus().equals(Status.Closed)) {
            if (request.getStatus() != oldRequest.getStatus()) {
                if (sendMessage) {
                    tgService.sendUpdateMessageToGroup(request, bidType);
                } else {
                    tgService.closeRequestMessage(request.getEmployee().getChatId(), request);
                }
            }
        }
    }

}
