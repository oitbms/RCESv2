package com.example.rces;

import com.example.rces.models.Employee;
import com.example.rces.models.enums.Role;

import java.util.ArrayList;
import java.util.List;

public class testData {

    static Employee getCreateEmployee() {
        Employee employee = new Employee();
        employee.setId(1L);
        employee.setName("TEST");
        employee.setChatId(1L);
        employee.setPassword(String.valueOf(123456));
        employee.setActive(true);
        employee.setRole(Role.USER.getName());
        return employee;
    }

    public static List<Employee> getListEmployees() {
        List<Employee> employees = new ArrayList<>();
        employees.add(getCreateEmployee());
        employees.add(getCreateEmployee());
        employees.add(getCreateEmployee());
        return employees;
    }

}
