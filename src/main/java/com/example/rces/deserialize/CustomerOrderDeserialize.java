package com.example.rces.deserialize;

import com.example.rces.models.CustomerOrder;
import com.example.rces.models.Employee;
import com.example.rces.service.CustomerOrderService;
import com.example.rces.service.EmployeeService;
import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomerOrderDeserialize extends JsonDeserializer<CustomerOrder> {

    private final CustomerOrderService customerOrderService;
    private final EmployeeService employeeService;

    @Autowired
    public CustomerOrderDeserialize(CustomerOrderService customerOrderService, EmployeeService employeeService) {
        this.customerOrderService = customerOrderService;
        this.employeeService = employeeService;
    }

    @Override
    public CustomerOrder deserialize(JsonParser p, DeserializationContext ctxt) throws IOException, JacksonException {
        String customerOrderName = p.getValueAsString();
        Employee currentUser = employeeService.getCurrentUser();
        if (customerOrderName == null) {
            return null;
        }
        return customerOrderService.createOrGetCustomerOrder(currentUser, customerOrderName, null);
    }


}

