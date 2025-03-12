//сервис главного окна технолога
package com.example.rces.services;

import com.example.rces.controller.payload.TechnologistPayload;
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
    public Technologist createTechnologist(TechnologistPayload payload) {
        Integer newRequestNumber = repository.findTopByOrderByRequestNumberDesc() + 1;

        Technologist newTechnologist = new Technologist();
        newTechnologist.setEmployee(payload.employee());
        newTechnologist.setImage(payload.image());
        newTechnologist.setReason(payload.reason());
        newTechnologist.setCustomerOrder(payload.customerOrder());
        newTechnologist.setRequestNumber(newRequestNumber);

        return repository.save(newTechnologist);
    }


}
