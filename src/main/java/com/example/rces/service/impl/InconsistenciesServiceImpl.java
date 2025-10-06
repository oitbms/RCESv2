package com.example.rces.service.impl;

import com.example.rces.models.Inconsistency;
import com.example.rces.repository.InconsistenciesAuditingRepository;
import com.example.rces.service.InconsistenciesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InconsistenciesServiceImpl implements InconsistenciesService {

    private final InconsistenciesAuditingRepository repo;

    @Autowired
    InconsistenciesServiceImpl(InconsistenciesAuditingRepository repo) {
        this.repo = repo;
    }

    @Override
    public List<Inconsistency> findAllInconsistencies() {
        return repo.findAll();
    }

    @Override
    public Inconsistency createInconsistency(String name, String controlType) {
        Inconsistency inconsistent = repo.findByName(name);
        if (inconsistent != null) {
            throw new RuntimeException("Несоответствие с названием (" + name + ") уже существует!");
        }
        Inconsistency inconsistency = new Inconsistency();
        inconsistency.setName(name);
        inconsistency.setControlType(controlType);
        return repo.save(inconsistency);
    }
}
