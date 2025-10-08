package com.example.rces.service.impl;

import com.example.rces.dto.InconsistencyCreateDto;
import com.example.rces.dto.InconsistencyDto;
import com.example.rces.mapper.InconsistenciesMapper;
import com.example.rces.models.Inconsistency;
import com.example.rces.repository.InconsistenciesRepository;
import com.example.rces.service.InconsistenciesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InconsistenciesServiceImpl implements InconsistenciesService {

    private final InconsistenciesRepository repository;
    private final InconsistenciesMapper mapper;

    @Autowired
    InconsistenciesServiceImpl(InconsistenciesRepository repo, InconsistenciesMapper mapper) {
        this.repository = repo;
        this.mapper = mapper;
    }

    @Override
    public List<Inconsistency> findAllInconsistencies() {
        return repository.findAll();
    }

    @Override
    public InconsistencyDto createInconsistency(InconsistencyCreateDto dto) {
        Inconsistency inconsistency = mapper.toInconsistency(dto);
        return mapper.toInconsistenciesDto(inconsistency);
    }
}
