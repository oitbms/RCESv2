package com.example.rces.services;

import com.example.rces.models.CustomerOrder;
import com.example.rces.models.Employee;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApiServices {

    @PersistenceContext
    private EntityManager entityManager;

    public List<CustomerOrder> findAllCustomerOrder() {
        return entityManager.createQuery("select e from CustomerOrder e", CustomerOrder.class).getResultList();
    }

    public List<Employee> findAllEmployees(String role) {
        return entityManager.createQuery("select e from Employee e where e.role =: role", Employee.class)
                .setParameter("role", role)
                .getResultList();
    }


}
