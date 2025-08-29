package com.example.rces.service.impl;

import com.example.rces.models.CustomerOrder;
import com.example.rces.models.Employee;
import com.example.rces.repository.CustomerOrderRepository;
import com.example.rces.service.CustomerOrderService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional(transactionManager = "primaryTransactionManager")
public class CustomerOrderServiceImpl implements CustomerOrderService {

    private final CustomerOrderRepository repository;
    private final ObjectMapper objectMapper;

    @Autowired
    public CustomerOrderServiceImpl(CustomerOrderRepository repository, ObjectMapper objectMapper) {
        this.repository = repository;
        this.objectMapper = objectMapper;
    }


    @Override
    public CustomerOrder createOrGetCustomerOrder(Employee createdEmployee, String customerOrderName, String customerOrderJson) {
        try {
            CustomerOrder existingOrder = null;
            if (!customerOrderName.isBlank()) {
                CustomerOrder customerOrder = repository.findByName(customerOrderName);
                if (customerOrder != null) {
                    existingOrder = customerOrder;
                }
            }
            CustomerOrder jsonOrder = null;
            if (customerOrderJson != null && !customerOrderJson.isBlank()) {
                jsonOrder = objectMapper.readValue(customerOrderJson, CustomerOrder.class);
            }
            if (existingOrder != null && jsonOrder != null) {
                if (existingOrder.getName().equals(jsonOrder.getName())) {
                    return jsonOrder;
                }
            } else if (existingOrder != null) {
                return existingOrder;
            } else {
                CustomerOrder newOrder = new CustomerOrder();
                newOrder.setCreateDate(LocalDateTime.now());
                newOrder.setEmployee(createdEmployee);
                newOrder.setName(customerOrderName);
                return repository.save(newOrder);
            }
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Ошибка при десериализации JSON CustomerOrder", e);
        }
        return null;
    }

    @Override
    public List<CustomerOrder> findAll() {
        return repository.findAll();
    }

}
