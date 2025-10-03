package com.example.rces.mapper;

import com.example.rces.dto.EmployeeDTO;
import com.example.rces.models.Employee;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface EmployeeMapper {

    @Mapping(target = "password", ignore = true)
    Employee to(EmployeeDTO dto);

    EmployeeDTO from(Employee entity);

    @Mapping(target = "password", ignore = true)
    void update(EmployeeDTO dto, @MappingTarget Employee entity);
}
