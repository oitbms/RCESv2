package com.example.rces.service;

import com.example.rces.dto.EmployeeDTO;
import com.example.rces.dto.EmployeeWorkCalendarDto;
import com.example.rces.models.Employee;

import java.util.List;

public interface EmployeeService {

    void save(String username, String mlmNode, String role, String password, Long chatId);

    void update(String userName, String mlmNodeName, String notificationAppName, String roleName, Long chatId, Boolean active);

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
