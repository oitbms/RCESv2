package com.example.rces.services;

import com.example.rces.controller.payload.ImagesPayload;
import com.example.rces.models.*;
import com.example.rces.models.enums.Inconsistency;
import com.example.rces.models.enums.Status;
import com.example.rces.services.telegram.MessageType;
import com.example.rces.services.telegram.TelegramService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.Entity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import static com.example.rces.utils.ServiceUtil.*;

@Service
public class ApiServices {

    private final UniversalService service;
    private final TelegramService tgService;
    private final ObjectMapper objectMapper;
    private final CustomUserDetailsService userDetailsService;

    @Autowired
    public ApiServices(UniversalService service, TelegramService tgService, ObjectMapper objectMapper, CustomUserDetailsService userDetailsService) {
        this.service = service;
        this.tgService = tgService;
        this.objectMapper = objectMapper;
        this.userDetailsService = userDetailsService;
    }

    public List<CustomerOrder> findAllCustomerOrder() {
        return service.findAll(CustomerOrder.class);
    }

    public List<Employee> findAllEmployees(Object role) {
        return service.findAllByField(Employee.class, "role", role);
    }

    public List<ImagesPayload> findImages(UUID param) {
        List<Images> images;
        Requests request = service.findById(Requests.class, param);
        FactExecutionSGI factExecutionSGI = service.findById(FactExecutionSGI.class, param);
        if (request != null) {
            images = service.findAllByField(Images.class, "request", request);
        } else if (factExecutionSGI != null) {
            images = service.findAllByField(Images.class, "sgi", factExecutionSGI);
        } else {
            SGI sgi = service.findById(SGI.class, param);
            images = service.findAllByField(Images.class, "sgim", sgi);
        }

        return images.stream()
                .map(image -> new ImagesPayload(
                        image.getId(),
                        image.getName(),
                        image.getBase64Data(),
                        request != null ? image.getRequest().getId() : image.getSgi() != null ? image.getSgi().getId() : image.getSgim().getId()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public void update(UUID id, Boolean sendMessage, Map<String, Object> updatedFields) {
        Requests request = service.findById(Requests.class, id);
        Requests oldRequest;
        try {
            oldRequest = (Requests) request.clone();
        } catch (CloneNotSupportedException e) {
            throw new RuntimeException(e);
        }

        Employee updaterEmployee = getUpdater();

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
                    } else if (method.getParameterTypes()[0].isEnum() && value != null) {
                        Class<? extends Enum<?>> enumClass = (Class<? extends Enum<?>>) method.getParameterTypes()[0];
                        value = enumClass.getMethod("fromField", Object.class).invoke(null, value.toString());
                    } else if (method.getParameterTypes()[0].isAnnotationPresent(Entity.class) && value != null) {
                        value = objectMapper.readValue((String) value, method.getParameterTypes()[0]);
                    } else if (key.equals("images") && value != null) {
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
                    } else if (key.equals("inconsistency")) {
                        value = Inconsistency.fromField(value);
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
        request.setUpdateDate(LocalDateTime.now());
        request.setDateWork(LocalDateTime.now());
        request.setVersion(request.getVersion() + 1);
        createLog(oldRequest, request, updaterEmployee, service);
        service.save(request);
        if (sendMessage) {
            if (!updaterEmployee.getId().equals(request.getEmployee().getId())) {
                tgService.sendMessage(request, request.getEmployee(), MessageType.REDIRECT);
            }
        }
    }

    public String getTypeRequest(UUID id) {
        return service.findById(Requests.class, id).getTypeRequest().name();
    }

    @Transactional
    public void getRequest(UUID id, String description, Boolean status) {
        Requests request = service.findById(Requests.class, id);
        Requests oldRequest;
        Employee updaterEmployee = getUpdater();

        try {
            oldRequest = (Requests) request.clone();
        } catch (CloneNotSupportedException e) {
            throw new RuntimeException(e);
        }

        if (request.getInconsistency().isEmpty()) {
            if (status == null) {
                if (request.getStatus() == Status.New) {
                    if (request.getEmployee().equals(updaterEmployee)) {
                        request.setStatus(Status.InWork);
                        tgService.sendMessage(request, request.getCreatedBy(), MessageType.WORK);
                    } else {
                      throw new RuntimeException("Пользователь не ответственный за заявку!");
                    }
                } else if (request.getStatus() == Status.InWork) {
                    request.setDescription(description);
                    request.setStatus(Status.Completed);
                    tgService.sendMessage(request, request.getCreatedBy(), MessageType.COMPLETED);
                }
            } else {
                if (status) {
                    request.setStatus(Status.Closed);
                    tgService.sendMessage(request, request.getCreatedBy(), MessageType.CLOSE);
                } else {
                    request.setStatus(Status.New);
                    tgService.sendMessage(request, request.getEmployee(), MessageType.UPDATE);
                }
            }
        } else {
            request.setDescription(description);
            request.setStatus(Status.Cancel);
            tgService.sendMessage(request, request.getCreatedBy(), MessageType.CANCEL);
        }

        request.setUpdateBy(updaterEmployee);
        request.setUpdateDate(LocalDateTime.now());
        request.setDateWork(LocalDateTime.now());
        request.setVersion(request.getVersion() + 1);
        createLog(oldRequest, request, updaterEmployee, service);
        service.save(request);
    }

    public void deleteImages(UUID id, UUID reqId) {
        Images images = service.findById(Images.class, id);
        Requests requests = service.findById(Requests.class, reqId);
        Employee user = userDetailsService.currentUser();

        if (!requests.getEmployee().getName().equals(user.getName())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Пользователь не может удалять фото!");
        }

        if (images == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Images not found with id: " + id);
        }

        service.deletePhoto(images.getId());
    }


    public Employee getUpdater() {
        return userDetailsService.currentUser();
    }

    public List<RequestLog> getLogs(UUID id) {
        return service.findAllByField(RequestLog.class, "request", service.findById(Requests.class, id));
    }

    public List<FactExecutionSGI> getExecutions(UUID id) {
        return service.findAllByField(FactExecutionSGI.class, "sgi", service.findById(SGI.class, id));
    }

    public Page<SGI> getPage(int page, int size) {
        return service.getPage(SGI.class, page, size);
    }

    public SGI getSgi(UUID id) {
        return service.findById(SGI.class, id);
    }

    public List<SGI> getSgiList(List<UUID> ids, String department) {
        if (department != null) {
            return service.findAllByField(SGI.class, "department", Arrays.stream(SGI.Department.values())
                    .filter(d -> d.getName().equals(department))
                    .findFirst()
                    .map(SGI.Department::name)
                    .orElse(null)).stream().filter(sgi -> !sgi.getAgreed()).collect(Collectors.toList());
        } else {
            return service.findAllByField(SGI.class, "id", ids);
        }
    }

    public void createCommentBid (UUID id, String comment) {
        Requests requests = service.findById(Requests.class, id);
        requests.setCommentAgreed(comment);
        service.save(requests);
    }

}
