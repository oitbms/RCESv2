package com.example.rces.controller.api.service;

import com.example.rces.models.CustomerOrder;
import com.example.rces.models.Employee;
import com.example.rces.services.CustomUserDetailsService;
import com.example.rces.services.UniversalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class ApiService {

    private final UniversalService service;
    private final CustomUserDetailsService userDetailsService;

    @Autowired
    public ApiService(UniversalService service, CustomUserDetailsService userDetailsService) {
        this.service = service;
        this.userDetailsService = userDetailsService;
    }

    public List<CustomerOrder> findAllCustomerOrder() {
        return service.findAll(CustomerOrder.class);
    }

    public List<Employee> findAllEmployees(Object role) {
        if (role!=null) {
            return service.findAllByField(Employee.class, "role", role);
        }
        return service.findAll(Employee.class);
    }

    public Employee getUpdater() {
        return userDetailsService.currentUser();
    }

}
