package com.example.rces.service.impl;

import com.example.rces.dto.SpmCreateDTO;
import com.example.rces.dto.SpmDTO;
import com.example.rces.mapper.SpmMapper;
import com.example.rces.models.Spm;
import com.example.rces.models.enums.Color;
import com.example.rces.repository.SpmRepository;
import com.example.rces.service.SpmService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.OptimisticLockException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@Transactional(transactionManager = "primaryTransactionManager")
public class SpmServiceImpl implements SpmService {

    private final SpmRepository repository;
    private final SpmMapper mapper;
    private final ObjectMapper objectMapper;

    @Autowired
    public SpmServiceImpl(SpmRepository repository, SpmMapper mapper, ObjectMapper objectMapper) {
        this.repository = repository;
        this.mapper = mapper;
        this.objectMapper = objectMapper;
    }

    @Override
    public List<SpmDTO> getAllSpm() {
        return mapper.toDTOList(repository.findAll());
    }

    @Override
    public SpmDTO createItem(SpmCreateDTO dto) {
        Spm spm = mapper.toEntityFromCreateDTO(dto);
        spm.setColor(Color.NONE);
        Spm saved = repository.save(spm);
        return mapper.toDTO(saved);
    }

    @Override
    public SpmDTO updateSpm(Long id, Long version, Map<String, Object> changes) {
        Spm spmEntity = repository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(String.format("SPM с id %s не найдено", id)));
        if (!Objects.equals(spmEntity.getVersion(), version)) {
            throw new OptimisticLockException("SPM с id " + id + " устарел");
        }
        try {
            objectMapper.readerForUpdating(spmEntity)
                    .readValue(objectMapper.writeValueAsBytes(changes));
        } catch (Exception e) {
            throw new ApplicationContextException("Ошибка при обновлении SPM", e);
        }
        repository.save(spmEntity);
        spmEntity.setVersion(spmEntity.getVersion() + 1);
        return mapper.toDTO(spmEntity);
    }

    @Override
    public void deleteSpm(Long id) {
        repository.deleteById(id);
    }

    @Override
    public List<SpmDTO> createItemFromSpm(List<SpmCreateDTO> listDTO) {
        List<Spm> spmList = new ArrayList<>();
        for (SpmCreateDTO dto : listDTO) {
            Spm spm = new Spm(dto.getCustomerOrderLine(), dto.getDateStart().toLocalDate(), dto.getPriority());
            Spm saved = repository.save(spm);
            spmList.add(saved);
        }
        return mapper.toDTOList(spmList);
    }
}
