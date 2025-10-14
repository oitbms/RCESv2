package com.example.rces.mapper;

import com.example.rces.dto.EmployeeCreateDTO;
import com.example.rces.dto.EmployeeDTO;
import com.example.rces.models.Employee;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface EmployeeMapper extends BaseMapper<Employee, EmployeeDTO, EmployeeCreateDTO> {

    @Override
    Employee toEntity(EmployeeDTO dto);

    @Override
    EmployeeDTO toDTO(Employee entity);

    @Override
    void update(EmployeeDTO dto, @MappingTarget Employee entity);
}
