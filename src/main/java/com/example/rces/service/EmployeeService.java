package com.example.rces.service;

import com.example.rces.dto.EmployeeCreateDTO;
import com.example.rces.dto.EmployeeDTO;
import com.example.rces.dto.EmployeeUpdateDTO;
import com.example.rces.dto.EmployeeWorkCalendarDto;
import com.example.rces.models.Employee;
import org.springframework.data.domain.Page;

import java.util.List;

public interface EmployeeService {

    EmployeeDTO create(EmployeeCreateDTO createDTO);

    EmployeeDTO update(Long id, Long version, EmployeeUpdateDTO updateDTO);

    EmployeeDTO findById(Long id);

    Page<EmployeeDTO> findPage(String query,
                               String role,
                               Boolean active,
                               Long subDivisionId,
                               int page,
                               int size,
                               String sort,
                               String direction);

    void deleteById(Long id);

    Employee loadUserByUsername(String name);

    Boolean currentUserHaveControlRoles();

    Boolean isResponsible(Employee responsobleEmployee);

    EmployeeDTO getCurrentUserDTO();

    Employee getCurrentUser();

    List<EmployeeDTO> findAllByRole(String role);

    void setSecurityContext(Employee employee);

    List<EmployeeDTO> findAll();

    List<EmployeeWorkCalendarDto> findEmployeeWorkCalendar(String role);

    Employee getReferenceById(Long id);

}
