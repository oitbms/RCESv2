package com.example.rces.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UniversalService {
    private final UniversalRepository repository;

    public UniversalService(UniversalRepository repository) {
        this.repository = repository;
    }

    public <T> T findById(Class<T> entityClass, Object id) {
        return repository.findById(entityClass, id);
    }

    public <T> T save(T entity) {
        return repository.save(entity);
    }

    public <T> void delete(T entity) {
        repository.delete(entity);
    }

    public <T> List<T> findAll(Class<T> entityClass) {
        return repository.findAll(entityClass);
    }

    public <T> List<T> findByField(Class<T> entityClass, String fieldName, Object value) {
        return repository.findByField(entityClass, fieldName, value);
    }

    public <T> T findByRequestNumber(Class<T> entityClass, Object requestNumber) {
        return repository.findByRequestNumber(entityClass, requestNumber);
    }

}