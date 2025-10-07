package com.example.rces.mapper;

import com.example.rces.dto.EmployeeCreateDTO;
import com.example.rces.dto.EmployeeDTO;
import com.example.rces.models.Employee;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface EmployeeMapper extends BaseMapper<Employee, EmployeeDTO, EmployeeCreateDTO> {

    @Override
    @Mapping(target = "password", ignore = true)
    Employee toEntity(EmployeeDTO dto);

    @Override
    EmployeeDTO toDTO(Employee entity);

    @Override
    @Mapping(target = "password", ignore = true)
    void update(EmployeeDTO dto, @MappingTarget Employee entity);
}
