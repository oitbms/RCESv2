package com.example.rces.service.impl;

import com.example.rces.dto.SpeCreateDTO;
import com.example.rces.dto.SpeDTO;
import com.example.rces.mapper.SPEMapper;
import com.example.rces.repository.SpeRepository;
import com.example.rces.service.SpeService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(transactionManager = "primaryTransactionManager")
public class SpeServiceImpl implements SpeService {

    private final SpeRepository repository;
    private final SPEMapper mapper;

    @Autowired
    public SpeServiceImpl(SpeRepository repository, SPEMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public SpeDTO createSPE(SpeCreateDTO dto) {
        var newSPE = mapper.to(dto);
        var savedSpe = repository.save(newSPE);
        return mapper.from(savedSpe);
    }

    @Override
    public List<SpeDTO> getAllSPE() {
        var allSPE = repository.findAll();
        return allSPE.stream().map(mapper::from).toList();
    }

    @Override
    public SpeDTO updateSPE(SpeDTO dto) {
        var speEntity = repository.findById(dto.getNumber()).orElseThrow(
                () -> new EntityNotFoundException(String.format("Spe с id %s не найдено", dto.getNumber())));
        mapper.update(dto, speEntity);
        repository.save(speEntity);
        return mapper.from(speEntity);
    }

    @Override
    public void deleteSpe(SpeDTO dto) {
        var spe = mapper.to(dto);
        repository.delete(spe);
    }

}
