package com.example.rces.services;

import com.example.rces.models.CustomerOrder;
import com.example.rces.models.Employee;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.util.List;

public class MainServices {

    @PersistenceContext
    private EntityManager entityManager;

    public List<CustomerOrder> findAllCustomerOrder() {
        return entityManager.createQuery("select e from CustomerOrder e", CustomerOrder.class).getResultList();
    }

    public List<Employee> findAllEmployees() {
        return entityManager.createQuery("select e from Employee e", Employee.class).getResultList();
    }


}
