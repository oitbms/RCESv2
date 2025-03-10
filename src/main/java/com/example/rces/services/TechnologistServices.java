//сервис главного окна технолога
package com.example.rces.services;

import com.example.rces.repository.TechnologistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TechnologistServices {

    @Autowired
    TechnologistRepository repository;


}
