package com.example.rces.service;

import com.example.rces.dto.SgiCreateDTO;
import com.example.rces.dto.SgiDTO;
import com.example.rces.models.SGI;
import org.springframework.context.ApplicationContextException;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SgiService {

    SgiDTO createSGI(SgiCreateDTO dto);

    Page<SgiDTO> getPage(int page, int size);

    Optional<SGI> findById(UUID id);

    List<SGI> findAll();

    List<SGI> findAllByIds(List<UUID> ids);

    void delete(SGI sgi);

    void save(SGI sgi);

    void saveAll(List<SGI> sgiList);

    SGI save(SGI sgi, Boolean agreed) throws ApplicationContextException, CloneNotSupportedException;

    SgiDTO save(SGI sgi, String workcenter, String event, String actions, String department, LocalDate desiredDate, LocalDate planDate,
                String employee, String note, LocalDate executionDate, Boolean factExecutionSGIBool, LocalDate executionDate2, String report,
                MultipartFile[] imagesSGI, MultipartFile[] imagesFactSGI) throws CloneNotSupportedException;

}
