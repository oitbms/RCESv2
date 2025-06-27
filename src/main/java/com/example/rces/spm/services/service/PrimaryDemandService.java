package com.example.rces.spm.services.service;

import com.example.rces.spm.models.*;
import com.example.rces.spm.services.SPMRepository;
import org.springframework.context.ApplicationContextException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PrimaryDemandService {
    private final SPMRepository repository;

    public PrimaryDemandService(SPMRepository repository) {
        this.repository = repository;
    }

    public JobComponent getMainJobComponentForPrimaryDemand(PrimaryDemand primaryDemand) {
        List<JobComponent> results = repository.getEntityManager()
                .createQuery("""
                    SELECT jc
                    FROM JobComponent jc
                    WHERE jc.item.id = :itemId
                    AND jc.primarydemand.id = :pdId
                    AND jc.bomLevel = 1
                    """, JobComponent.class)
                .setParameter("itemId", primaryDemand.getItem().getId())
                .setParameter("pdId", primaryDemand.getId())
                .getResultList();
        return results.isEmpty() ? null : results.get(0);
    }
}
