package com.example.rces.service.impl;

import com.example.rces.models.SubDivision;
import com.example.rces.repository.SubDivisionRepository;
import com.example.rces.service.SubDivisionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Transactional(transactionManager = "primaryTransactionManager")
public class SubDivisionServiceImpl implements SubDivisionService {

    private final SubDivisionRepository repository;
    private final Map<String, SubDivision> cache = new ConcurrentHashMap<>();

    @Autowired
    public SubDivisionServiceImpl(SubDivisionRepository repository) {
        this.repository = repository;
    }

    @Override
    public SubDivision getByName(String name) {
        return cache.computeIfAbsent(name, repository::findByName);
    }


}
