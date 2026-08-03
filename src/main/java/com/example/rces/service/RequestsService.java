package com.example.rces.service;

import com.example.rces.dto.CreateRequestDto;
import com.example.rces.dto.RequestDto;
import com.example.rces.dto.RequestParamsDto;
import com.example.rces.models.Employee;
import com.example.rces.models.Inconsistency;
import com.example.rces.models.Requests;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

public interface RequestsService {

    RequestDto createRequest(Employee createdEmployee, CreateRequestDto createRequestDto, MultipartFile[] additionalFiles) throws JsonProcessingException;

    void save(Requests requests);

    void save(RequestParamsDto paramsDto, Set<Inconsistency> inconsistencyData);

    void update(UUID id, Boolean sendMessage, Map<String, Object> updatedFields);

    void createComment(UUID id, String comment);

    Requests findById(UUID id);

    List<RequestDto> findByEmployeeId(Long id);

    List<RequestDto> findByEmployeeIds(List<Long> ids);

    Requests findByRequestNumber(Integer requestNumber);

    List<Requests> findAllByTypeRequest(Requests.Type type);

    List<Requests> findAll();

    String getTypeRequest(UUID id);

    void updateCreateBy(UUID id, String user);

    Page<Requests> findAllByTypeRequest(Specification<Requests> spec, Pageable pageable);

    List<RequestDto> findAllRequestsByStatus(String role);

}
