package com.example.rces.service.impl;

import com.example.rces.dto.CreateRequestDto;
import com.example.rces.dto.RequestDto;
import com.example.rces.mapper.RequestMapper;
import com.example.rces.models.*;
import com.example.rces.models.enums.GeneralReason;
import com.example.rces.models.enums.Item;
import com.example.rces.models.enums.MlmNode;
import com.example.rces.models.enums.Status;
import com.example.rces.repository.RequestsRepository;
import com.example.rces.service.*;
import com.example.rces.utils.telegram.MessageType;
import com.example.rces.utils.telegram.event.TelegramRequestEvent;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.Entity;
import jakarta.ws.rs.ForbiddenException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.telegram.telegrambots.meta.api.objects.Message;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.time.LocalDateTime;
import java.util.*;

import static com.example.rces.utils.
        FilesUtil.handleImageCollection;
import static com.example.rces.utils.FilesUtil.isJson;

@Service
@Transactional(transactionManager = "primaryTransactionManager")
public class RequestServiceImpl implements RequestsService {

    private final RequestsRepository repository;
    private final ObjectMapper objectMapper;
    private final TelegramService telegramService;
    private final CustomerOrderService customerOrderService;
    private final ImageService imageService;
    private final EmployeeService employeeService;
    private final InconsistenciesService inconsistenciesService;
    private final RequestMapper requestMapper;

    @Autowired
    public RequestServiceImpl(RequestsRepository repository, ObjectMapper objectMapper,
                              TelegramService telegramService, CustomerOrderService customerOrderService,
                              ImageService imageService, EmployeeService employeeService,
                              InconsistenciesService inconsistenciesService, RequestMapper requestMapper) {
        this.repository = repository;
        this.objectMapper = objectMapper;
        this.telegramService = telegramService;
        this.customerOrderService = customerOrderService;
        this.imageService = imageService;
        this.employeeService = employeeService;
        this.inconsistenciesService = inconsistenciesService;
        this.requestMapper = requestMapper;
    }

    @Override
    public RequestDto createRequest(Employee createdEmployee, CreateRequestDto createRequestDto) throws JsonProcessingException {
        Employee employee = objectMapper.readValue(createRequestDto.getEmployeeJson(), Employee.class);
        employee = employeeService.loadUserByUsername(employee.getUsername());
        CustomerOrder customerOrder = customerOrderService.createOrGetCustomerOrder(createdEmployee,
                createRequestDto.getCustomerOrderString(), createRequestDto.getCustomerOrderJson());
        GeneralReason reason = null;
        String reasonText = null;
        if (Objects.equals(createRequestDto.getType(), "otk")) {
            reasonText = String.valueOf(createRequestDto.getReasonsJson());
        } else {
            if (!createRequestDto.getReasonsJson().isBlank()) {
                reason = objectMapper.readValue(createRequestDto.getReasonsJson(), GeneralReason.class);
            }
        }
        Item item = null;
        if (createRequestDto.getItemNameJson() != null && !createRequestDto.getItemNameJson().isBlank()) {
            item = objectMapper.readValue(createRequestDto.getItemNameJson(), Item.class);
        }
        MlmNode mlmNode = null;
        if (!createRequestDto.getMlmNodeJson().isBlank()) {
            mlmNode = MlmNode.valueOf(createRequestDto.getMlmNodeJson());
        }
        createRequestDto.setRequestNumber(repository.findNextRequestNumber());
        Requests requests = requestMapper.createFullRequest(
                createRequestDto,
                objectMapper,
                item,
                reason,
                mlmNode,
                employee,
                customerOrder,
                createdEmployee
        );
        return requestMapper.toDTO(repository.save(requests));
    }

    @Override
    public void save(Requests requests) {
        repository.save(requests);
    }

    @Override
    public void save(UUID id, String description, String status, Integer qty, Set<Inconsistency> inconsistencyData) {
        Requests request = repository.findById(id).orElseThrow(() -> new ApplicationContextException("Не существует заявки с id: " + id));
        Employee updaterEmployee = employeeService.getCurrentUser();

        if (status == null) {
            if (request.getEmployee().equals(updaterEmployee)) {
                if (request.getStatus().equals(Status.New)) {
                    request.setStatus(Status.InWork);
                    telegramService.sendMessageForRequest(new TelegramRequestEvent(this, request, request.getCreatedBy(), MessageType.WORK));
                } else if (!request.getInconsistencies().isEmpty()) {
                    request.setStatus(Status.Rejected);
                    request.setDescription(description);
                    request.setQtyRejected(request.getQtyRejected() + 1);
                    telegramService.sendMessageForRequest(new TelegramRequestEvent(this, request, request.getCreatedBy(), MessageType.CANCEL));
                }
            } else {
                throw new ForbiddenException("Пользователь не может изменять заявку!");
            }
        } else if (status.equals("closed")) {
            if (Objects.equals(request.getQty(), qty)) {
                request.setStatus(Status.Closed);
                Message message = telegramService.sendMessageForRequest(new TelegramRequestEvent(this, request, request.getCreatedBy(), MessageType.CLOSE));
                request.setCloseDate(LocalDateTime.now());
                request.setClosedEmployee(updaterEmployee);
                request.setChatId(message != null ? message.getChatId() : -1);
                request.setMessageId(message != null ? message.getMessageId() : -1);
            } else if (request.getQty() > qty) {
                Requests requestsRejected = addRequestRejected(request, qty, description, inconsistencyData);
                telegramService.sendMessageForRequest(new TelegramRequestEvent(this, requestsRejected, requestsRejected.getCreatedBy(), MessageType.REJECTED));
                request.getImages().clear();
                request.setStatus(Status.Closed);
                request.setQty(qty);
                telegramService.sendMessageForRequest(new TelegramRequestEvent(this, request, request.getCreatedBy(), MessageType.CLOSE));
                request.setCloseDate(LocalDateTime.now());
            }

        } else if (status.equals("update")) {
            request.setStatus(Status.New);
            request.getInconsistencies().clear();
            telegramService.sendMessageForRequest(new TelegramRequestEvent(this, request, request.getEmployee(), MessageType.UPDATE));
        } else if (status.equals("refresh")) {
            request.setStatus(Status.New);
        }

        request.setDateWork(LocalDateTime.now());
        request.setVersion(request.getVersion() + 1);
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
                            List<Images> images = new ArrayList<>(imageService.findAllByIds(imageIds));
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
                    }
                    else if (key.equals("inconsistencies")) {
                        value = Inconsistency.fromField(value, new HashSet<>(inconsistenciesService.findAll()));
                    }

                    method.invoke(request, value);
                } catch (NoSuchMethodException e) {
                    throw new RuntimeException("Метод " + key + " не найден", e);
                } catch (Exception e) {
                    throw new RuntimeException("Ошибка при обновлении поля " + key, e);
                }
            }
        });
        request.setDateWork(LocalDateTime.now());
        request.setVersion(request.getVersion() + 1);
        repository.save(request);
        if (!request.getEmployee().equals(oldRequest.getEmployee())) {
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

    private Requests addRequestRejected(Requests request, int qty, String description, Set<Inconsistency> inconsistencyData) {
        Requests requestsRejected = new Requests();
        requestsRejected.setCreatedBy(request.getCreatedBy());
        requestsRejected.setRequestNumber(repository.findNextRequestNumber());
        requestsRejected.setEmployee(request.getEmployee());
        requestsRejected.setMlmNode(request.getMlmNode());
        requestsRejected.setReason_wr(request.getReason_wr());
        requestsRejected.setStatus(Status.Rejected);
        requestsRejected.setQty(request.getQty() - qty);
        requestsRejected.setTitle(request.getTitle());
        requestsRejected.setItem(request.getItem());
        requestsRejected.setTypeRequest(request.getTypeRequest());
        requestsRejected.setCustomerOrder(request.getCustomerOrder());
        requestsRejected.setControl(request.getControl());
        requestsRejected.setInconsistencies(inconsistencyData);
        requestsRejected.setDescription(description);
        requestsRejected.setQtyRejected(request.getQtyRejected() + 1);
        requestsRejected.setImages(new ArrayList<>(request.getImages()).stream()
                .peek(images -> images.setRequest(requestsRejected))
                .toList());
        repository.save(requestsRejected);
        return requestsRejected;
    }

}
