//сервис главного окна технолога
package com.example.rces.services;

import com.example.rces.models.CustomerOrder;
import com.example.rces.models.Employee;
import com.example.rces.models.GeneralReason;
import com.example.rces.models.Technologist;
import com.example.rces.repository.TechnologistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TechnologistServices {

    @Autowired
    TechnologistRepository repository;

    @Transactional
    public Integer createTechnologist(Employee employee, CustomerOrder customerOrder, GeneralReason.Technologist reason) {
        Integer newRequestNumber = repository.findTopByOrderByRequestNumberDesc() + 1;

        Technologist newTechnologist = new Technologist();
        newTechnologist.setEmployee(employee);
        newTechnologist.setCustomerOrder(customerOrder);
        newTechnologist.setReason(reason);
        newTechnologist.setRequestNumber(newRequestNumber);
        repository.save(newTechnologist);

        return newRequestNumber;
    }


}
