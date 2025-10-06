package com.example.rces.service.impl;

import com.example.rces.dto.SpeCreateDTO;
import com.example.rces.dto.SpeDTO;
import com.example.rces.mapper.SPEMapper;
import com.example.rces.repository.SpeAuditingRepository;
import com.example.rces.service.SpeService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.OptimisticLockException;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@Transactional(transactionManager = "primaryTransactionManager")
public class SpeServiceImpl implements SpeService {

    private final SpeAuditingRepository repository;
    private final SPEMapper mapper;
    private final ObjectMapper objectMapper;

    @Autowired
    public SpeServiceImpl(SpeAuditingRepository repository, SPEMapper mapper, ObjectMapper objectMapper) {
        this.repository = repository;
        this.mapper = mapper;
        this.objectMapper = objectMapper;
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
    @SneakyThrows
    public SpeDTO updateSPE(Integer number, Long version, Map<String, Object> changes) {
        var speEntity = repository.findById(number).orElseThrow(
                () -> new EntityNotFoundException(String.format("Spe с id %s не найдено", number)));
        if (Objects.equals(speEntity.getVersion(), version)) {
            throw new OptimisticLockException("SPE с id " + number + " устарел");
        }
        objectMapper.updateValue(speEntity, changes);
        repository.save(speEntity);
        return mapper.from(speEntity);
    }

    @Override
    public void deleteSpe(SpeDTO dto) {
        var spe = mapper.to(dto);
        repository.delete(spe);
    }

}
