package com.example.rces.service;

import com.example.rces.controller.payload.EmployeePayload;
import com.example.rces.models.Employee;

import java.util.List;

public interface EmployeeService {

    void save(String username, String mlmNode, String role, String password, Long chatId);

    void update(Long id, String userName, String mlmNodeName, String roleName, Long chatId, Boolean active);

    void deleteById(Long id);

    Employee loadUserByUsername(String name);

    Boolean currentUserHaveControlRoles();

    Boolean isResponsible(Employee responsobleEmployee);

    Employee getCurrentUser();

    List<EmployeePayload> findAllByRole(String role);

    void setSecurityContext(Employee employee);

    List<EmployeePayload> findAll();
}
