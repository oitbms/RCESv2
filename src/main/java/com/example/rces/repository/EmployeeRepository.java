package com.example.rces.repository;

import com.example.rces.models.Employee;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends BaseAuditingRepository<Employee, Long> {

    List<Employee> findAllByRole(String role);

    Employee findByName(String name);
}
