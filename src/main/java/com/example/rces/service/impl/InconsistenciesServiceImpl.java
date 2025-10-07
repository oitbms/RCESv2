package com.example.rces.service.impl;

import com.example.rces.models.Inconsistency;
import com.example.rces.repository.InconsistenciesRepository;
import com.example.rces.service.InconsistenciesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InconsistenciesServiceImpl implements InconsistenciesService {

    private final InconsistenciesRepository repository;

    @Autowired
    InconsistenciesServiceImpl(InconsistenciesRepository repo) {
        this.repository = repo;
    }

    @Override
    public List<Inconsistency> findAllInconsistencies() {
        return repository.findAll();
    }

    @Override
    public Inconsistency createInconsistency(String name, String controlType) {
        return repository.save(new Inconsistency(name, controlType));
    }
}
