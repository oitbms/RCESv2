package com.example.rces.spm.services;

import com.example.rces.spm.services.service.CustomerOrderService;
import com.example.rces.spm.services.service.ItemService;
import com.example.rces.spm.services.service.JobComponentService;
import com.example.rces.spm.services.service.PrimaryDemandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
@Transactional(transactionManager = "spmTransactionManager")
public class SPMService {
    private final SPMRepository repository;

    private final PrimaryDemandService primaryDemandService;
    public PrimaryDemandService getPrimaryDemandService() {
        return primaryDemandService;
    }

    private final JobComponentService jobComponentService;
    public JobComponentService getJobComponentService() {
        return jobComponentService;
    }

    private final ItemService itemService;
    public ItemService getItemService() {
        return itemService;
    }

    private final CustomerOrderService customerOrderService;
    public CustomerOrderService getCustomerOrderService() {
        return customerOrderService;
    }

    @Autowired
    public SPMService(SPMRepository repository,
                      PrimaryDemandService primaryDemandService,
                      JobComponentService jobComponentService,
                      ItemService itemService,
                      CustomerOrderService customerOrderService) {
        this.repository = repository;
        this.primaryDemandService = primaryDemandService;
        this.jobComponentService = jobComponentService;
        this.itemService = itemService;
        this.customerOrderService = customerOrderService;
    }

    public <T> T findById(Class<T> entity, Object id) {
        return repository.findById(entity, id);
    }

    public <T> List<T> findAll(Class<T> entityClass) {
        return repository.findAll(entityClass);
    }

    public <T> List<T> findAllByField(Class<T> entityClass, String fieldName, Object fieldValue) {
        return repository.findByField(entityClass, fieldName, fieldValue);
    }

    public <T> List<T> executeQuery(String query, Class<T> entityClass, Boolean isNative) {
        return repository.executeQuery(query, entityClass, Collections.emptyMap(), isNative);
    }

    public <T> List<T> executeQuery(String query, Class<T> entityClass, String paramName, Object paramValue, Boolean isNative) {
        return repository.executeQuery(query, entityClass, Map.of(paramName, paramValue), isNative);
    }

    public <T> List<T> executeQuery(String query, Class<T> entityClass, Map<String, Object> params, Boolean isNative) {
        return repository.executeQuery(query, entityClass, params, isNative);
    }

    public <T> T findSingleByField(Class<T> entityClass, String fieldName, Object fieldValue) {
        return findAllByField(entityClass, fieldName, fieldValue).get(0);
    }
}
