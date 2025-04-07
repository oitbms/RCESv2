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
import java.lang.reflect.Method;
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
        Requests request = service.findById(Requests.class, param);
        List<Images> images = service.findAllByField(Images.class, "request", request);
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
                    String methodName = "set" + key.substring(0, 1).toUpperCase() + key.substring(1);
                    Method method = request.getClass().getMethod(methodName, fields.stream()
                            .filter(f -> f.getName().equals(key))
                            .findFirst()
                            .orElseThrow(() -> new NoSuchFieldException("Поле " + key + " не найдено"))
                            .getType());

                    if (key.equals("customerOrder") && !isJson(value)) {
                        CustomerOrder customerOrder = service.createOrGetCustomerOrder(objectMapper, updaterEmployee, (String) value, null);
                        method.invoke(request, customerOrder);
                        return;
                    }

                    if (method.getParameterTypes()[0].isEnum() && value != null) {
                        Class<? extends Enum<?>> enumClass = (Class<? extends Enum<?>>) method.getParameterTypes()[0];
                        value = enumClass.getMethod("fromField", Object.class).invoke(null, value.toString());
                    } else if (method.getParameterTypes()[0].isAnnotationPresent(Entity.class) && value != null) {
                        value = objectMapper.readValue((String) value, method.getParameterTypes()[0]);
                    }

                    if (method.getParameterTypes()[0].isInterface() && value != null) {
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
                                        service.save(newImage);
                                    });
                            handleImageCollection(request, images);
                            return;
                        }
                        handleImageCollection(request, (List<?>) value);
                        return;
                    }

                    method.invoke(request, value);
                } catch (NoSuchMethodException e) {
                    throw new RuntimeException("Метод " + key + " не найден", e);
                } catch (Exception e) {
                    throw new RuntimeException("Ошибка при обновлении поля " + key, e);
                }
            }
        });

        request.setUpdateBy(updaterEmployee);
        service.save(request);
        //Если нажали галку отправить в ТГ и поменяли статус
        if (sendMessage) {
            if (request.getStatus() != oldRequest.getStatus()) {
                if (request.getTypeRequest().equals(Requests.Type.constructor)) {
                    tgService.sendUpdateMessageToGroup(request, bidType);
                } else {
                    //если поменяли ответственного -> редирект сообщения иначе заявка обновлена
                    tgService.sendMessageToUser(request, updaterEmployee.getChatId(), request.getEmployee() != oldRequest.getEmployee());
                }

            }
            //если закрыли или отменили заявку
        } else if (request.getStatus().equals(Status.Closed) || request.getStatus().equals(Status.Cancel)) {
            tgService.closeOrCanceledRequestMessage(request, updaterEmployee);
        }
    }

    public String getTypeRequest(UUID id) {
        return service.findById(Requests.class, id).getTypeRequest().name();
    }
}
