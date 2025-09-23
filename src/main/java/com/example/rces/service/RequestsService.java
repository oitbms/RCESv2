package com.example.rces.service;

import com.example.rces.models.Employee;
import com.example.rces.models.Requests;
import com.example.rces.models.Inconsistency;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

public interface RequestsService {

    Requests createRequest(Employee createdEmployee, String employeeJson, String type,
                           String mlmNodeJson, String itemJson, String reasonsJson, Integer qty, String control,
                           String customerOrderName, String customerOrderJson, String comment, MultipartFile[] additionalFiles, String titleJson) throws JsonProcessingException;

    void save(Requests requests);

    void save(UUID id, String description, String status, Integer qty, Set<Inconsistency> inconsistencyData);

    void update(UUID id, Boolean sendMessage, Map<String, Object> updatedFields);

    void createComment(UUID id, String comment);

    Requests findById(UUID id);

    Requests findByRequestNumber(Integer requestNumber);

    List<Requests> findAllByTypeRequest(Requests.Type type);

    List<Requests> findAll();

    String getTypeRequest(UUID id);

}
