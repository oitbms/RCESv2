package com.example.rces.service.impl;

import com.example.rces.models.CustomerOrder;
import com.example.rces.models.Employee;
import com.example.rces.models.Images;
import com.example.rces.models.Requests;
import com.example.rces.models.enums.*;
import com.example.rces.repository.RequestsRepository;
import com.example.rces.service.*;
import com.example.rces.service.impl.telegram.MessageType;
import com.example.rces.service.impl.telegram.event.TelegramRequestEvent;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.Entity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.telegram.telegrambots.meta.api.objects.Message;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.time.LocalDateTime;
import java.util.*;

import static com.example.rces.utils.ServiceUtil.handleImageCollection;
import static com.example.rces.utils.ServiceUtil.isJson;

@Service
@Transactional(transactionManager = "primaryTransactionManager")
public class RequestServiceImpl implements RequestsService {

    private final RequestsRepository repository;
    private final ObjectMapper objectMapper;
    private final TelegramService telegramService;
    private final CustomerOrderService customerOrderService;
    private final ImageService imageService;
    private final EmployeeService employeeService;
    private final RequestLogService requestLogService;

    @Autowired
    public RequestServiceImpl(RequestsRepository repository, ObjectMapper objectMapper, TelegramService telegramService, CustomerOrderService customerOrderService, ImageService imageService, EmployeeService employeeService, RequestLogService requestLogService) {
        this.repository = repository;
        this.objectMapper = objectMapper;
        this.telegramService = telegramService;
        this.customerOrderService = customerOrderService;
        this.imageService = imageService;
        this.employeeService = employeeService;
        this.requestLogService = requestLogService;
    }

    @Override
    public Requests createRequest(Employee createdEmployee, String employeeJson, String type,
                                  String mlmNodeJson, String itemJson, String reasonsJson, Integer qty, String control,
                                  String customerOrderName, String customerOrderJson, String comment, MultipartFile[] additionalFiles) throws JsonProcessingException {
        Employee employee = objectMapper.readValue(employeeJson, Employee.class);
        if (employee.getChatId() == null) {
            throw new RuntimeException("Ошибка: chatId сотрудника равен null. Невозможно создать запрос и отправить сообщение пользователю.");
        }
        CustomerOrder customerOrder = customerOrderService.createOrGetCustomerOrder(createdEmployee, customerOrderName, customerOrderJson);

        GeneralReason reason = null;
        String reasonText = null;
        if (Objects.equals(type, "otk")) {
            reasonText = String.valueOf(reasonsJson);
        } else {
            if (!reasonsJson.isBlank()) {
                reason = objectMapper.readValue(reasonsJson, GeneralReason.class);
            }
        }
        Item item = null;
        if (itemJson != null && !itemJson.isBlank()) {
            item = objectMapper.readValue(itemJson, Item.class);
        }
        MlmNode mlmNode = null;
        if (!mlmNodeJson.isBlank()) {
            mlmNode = MlmNode.valueOf(mlmNodeJson);
        }

        Requests request = new Requests();

        request.setTypeRequest(Requests.Type.valueOf(type));
        request.setCreatedBy(createdEmployee);
        request.setCreateDate(LocalDateTime.now());
        request.setRequestNumber(repository.findNextRequestNumber());
        request.setEmployee(employee);
        request.setCustomerOrder(customerOrder);
        request.setReason(reason);
        request.setItem(item);
        request.setQty(qty);
        request.setControl(control);
        request.setMlmNode(mlmNode);
        request.setComment(comment != null ? comment : "");
        request.setStatus(Status.New);
        request.setReason_wr(reasonText);
        if (additionalFiles != null) {
            request.setImages(imageService.createImages(additionalFiles, request, false));
        }
        repository.save(request);
        telegramService.sendMessageForRequest(new TelegramRequestEvent(this, request, employee, MessageType.CREATE));
        return request;
    }

    @Override
    public void save(Requests requests) {
        repository.save(requests);
    }

    @Override
    public void save(UUID id, String description, Boolean status) {
        Requests request = repository.findById(id).orElseThrow(() -> new ApplicationContextException("Не существует заявки с id: " + id));
        Requests oldRequest;
        Employee updaterEmployee = employeeService.getCurrentUser();

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
                        telegramService.sendMessageForRequest(new TelegramRequestEvent(this, request, request.getCreatedBy(), MessageType.WORK));
                    } else {
                        throw new RuntimeException("Пользователь не ответственный за заявку!");
                    }
                } else if (request.getStatus() == Status.InWork) {
                    request.setDescription(description);
                    request.setStatus(Status.Completed);
                    telegramService.sendMessageForRequest(new TelegramRequestEvent(this, request, request.getCreatedBy(), MessageType.COMPLETED));
                }
            } else {
                if (status) {
                    request.setStatus(Status.Closed);
                    Message message = telegramService.sendMessageForRequest(new TelegramRequestEvent(this, request, request.getCreatedBy(), MessageType.CLOSE));
                    request.setCloseDate(LocalDateTime.now());
                    request.setClosedEmployee(updaterEmployee);
                    request.setChatId(message.getChatId());
                    request.setMessageId(message.getMessageId());
                    telegramService.sendMessageForRequest(new TelegramRequestEvent(this, request, request.getCreatedBy(), MessageType.COMPLETED_WORK));
                    repository.save(request);
                } else {
                    request.setStatus(Status.New);
                    telegramService.sendMessageForRequest(new TelegramRequestEvent(this, request, request.getEmployee(), MessageType.UPDATE));
                }
            }
        } else {
            request.setDescription(description);
            request.setStatus(Status.Cancel);
            Message message = telegramService.sendMessageForRequest(new TelegramRequestEvent(this, request, request.getCreatedBy(), MessageType.CANCEL));
            request.setCloseDate(LocalDateTime.now());
            request.setClosedEmployee(updaterEmployee);
            request.setChatId(message.getChatId());
            request.setMessageId(message.getMessageId());
            telegramService.sendMessageForRequest(new TelegramRequestEvent(this, request, request.getCreatedBy(), MessageType.COMPLETED_WORK));
            repository.save(request);
        }

        request.setUpdateBy(updaterEmployee);
        request.setUpdateDate(LocalDateTime.now());
        request.setDateWork(LocalDateTime.now());
        request.setVersion(request.getVersion() + 1);
        request.getLog().addAll(requestLogService.createLog(oldRequest, request, updaterEmployee));
        repository.save(request);
    }

    @Override
    public void update(UUID id, Boolean sendMessage, Map<String, Object> updatedFields) {
        Requests request = repository.findById(id).orElseThrow(() -> new ApplicationContextException("Не существует заявки с id: " + id));
        Requests oldRequest;
        try {
            oldRequest = (Requests) request.clone();
        } catch (CloneNotSupportedException e) {
            throw new RuntimeException(e);
        }

        Employee updaterEmployee = employeeService.getCurrentUser();

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
                        CustomerOrder customerOrder = customerOrderService.createOrGetCustomerOrder(updaterEmployee, (String) value, null);
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
                            List<Images> images = imageService.findAllByIds(imageIds);
                            ((ArrayList<?>) value).stream()
                                    .filter(String.class::isInstance)
                                    .map(String.class::cast)
                                    .forEach(imgStr -> {
                                        Images newImage = new Images(imgStr, request);
                                        images.add(newImage);
                                        imageService.save(newImage);
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
        request.getLog().addAll(requestLogService.createLog(oldRequest, request, updaterEmployee));
        repository.save(request);
        if (sendMessage) {
            if (!updaterEmployee.getId().equals(request.getEmployee().getId())) {
                telegramService.sendMessageForRequest(new TelegramRequestEvent(this, request, request.getEmployee(), MessageType.REDIRECT));
            }
        }
    }

    @Override
    public void createComment(UUID id, String comment) {
        Requests requests = repository.findById(id).orElseThrow(() -> new ApplicationContextException("Не существует заявки с id: " + id));
        requests.setCommentAgreed(comment);
        repository.save(requests);
    }

    @Override
    public Requests findById(UUID id) {
        return repository.findById(id).orElseThrow(() -> new ApplicationContextException("Не существует заявки с id: " + id));
    }

    @Override
    public Requests findByRequestNumber(Integer requestNumber) {
        return repository.findByRequestNumber(requestNumber);
    }

    @Override
    public List<Requests> findAllByTypeRequest(Requests.Type type) {
        return repository.findAllByTypeRequest(type);
    }

    @Override
    public List<Requests> findAll() {
        return repository.findAll();
    }

    @Override
    public String getTypeRequest(UUID id) {
        Requests requests = repository.findById(id).orElseThrow(() -> new ApplicationContextException("Не существует заявки с id: " + id));
        return requests.getTypeRequest().name();
    }

}
