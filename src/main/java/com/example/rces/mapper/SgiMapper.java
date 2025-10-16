package com.example.rces.mapper;

import com.example.rces.dto.SgiCreateDTO;
import com.example.rces.dto.SgiDTO;
import com.example.rces.models.SGI;
import com.example.rces.models.enums.Color;
import com.example.rces.repository.SgiRepository;
import com.example.rces.service.FactExecutionSgiService;
import com.example.rces.service.ImageService;
import jakarta.persistence.EntityNotFoundException;
import org.mapstruct.Mapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.UUID;

import static com.example.rces.utils.ServiceUtil.colorCalculate;

@Component
public class SgiMapper implements BaseMapper<SGI, SgiDTO, SgiCreateDTO> {

    private final SgiRepository repository;
    private final FactExecutionSgiService factExecutionSgiService;
    private final ImageService imageService;
    private final EmployeeMapper employeeMapper;

    @Autowired
    protected SgiMapper(SgiRepository repository, FactExecutionSgiService factExecutionSgiService, ImageService imageService, EmployeeMapper employeeMapper) {
        this.repository = repository;
        this.factExecutionSgiService = factExecutionSgiService;
        this.imageService = imageService;
        this.employeeMapper = employeeMapper;
    }

    @Override
    public SGI toEntityFromCreateDTO(SgiCreateDTO createDto) {
        SGI newSGI = new SGI();
        newSGI.setWorkShop(createDto.getWorkcenter());
        newSGI.setColor(Color.NONE);
        newSGI.setEvent(createDto.getEvent());
        newSGI.setActions(createDto.getActions());
        newSGI.setDepartment(SGI.Department.valueOf(createDto.getDepartment()));
        newSGI.setNote(createDto.getNote());
        newSGI.setDesiredDate(createDto.getDesiredDate());
        newSGI.setAgreed(false);
        newSGI.setEmployee(employeeMapper.toEntity(createDto.getEmployee()));
        if (!createDto.getParentId().isEmpty()) {
            SGI parentSGi = repository.findById(UUID.fromString(createDto.getParentId()))
                    .orElseThrow(() -> new EntityNotFoundException("Родительская задача не найдена"));
            newSGI.setParentSGI(parentSGi);
            newSGI.setRequestNumber(0);
        } else {
            newSGI.setRequestNumber(repository.findNextRequestNumber());
        }
        newSGI.setExecution(factExecutionSgiService.createFactExecutionSGI(newSGI));
        if (createDto.getAdditionalFiles() != null) {
            newSGI.setImages(imageService.createImages(createDto.getAdditionalFiles(), newSGI, false));
        }
        newSGI.setColor(colorCalculate(newSGI, LocalDate.now()));

        return newSGI;
    }

    @Override
    public SgiDTO toDTO(SGI sgi) {
        SgiDTO dto = new SgiDTO();
        dto.setNumber(String.valueOf(sgi.getRequestNumber()));
        dto.setId(sgi.getId());
        dto.setWorkcenter(sgi.getWorkShop());
        dto.setEvent(sgi.getEvent());
        dto.setActions(sgi.getActions());
        dto.setDepartment(sgi.getDepartment().name());
        dto.setNote(sgi.getNote());
        dto.setDesiredDate(sgi.getDesiredDate());
        dto.setAgree(sgi.getAgreed());
        dto.setEmployee(employeeMapper.toDTO(sgi.getEmployee()));
        dto.setSubSGI(null);
        dto.setColor(sgi.getColor().name());
        dto.setDepartmentName(sgi.getDepartment().getName());
        dto.setPlanDate(sgi.getPlanDate());
        dto.setComment(sgi.getComment());
        return dto;
    }

    @Override
    public SGI toEntity(SgiDTO sgiDTO) {
        return null;
    }

    @Override
    public void update(SgiDTO dto, SGI entity) {

    }

}
