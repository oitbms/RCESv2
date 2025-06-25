package com.example.rces.spm.services.service;

import com.example.rces.spm.models.JobComponent;
import com.example.rces.spm.models.PrimaryDemand;
import com.example.rces.spm.services.SPMRepository;
import org.springframework.stereotype.Service;

@Service
public class PrimaryDemandService {
    private final SPMRepository repository;

    public PrimaryDemandService(SPMRepository repository) {
        this.repository = repository;
    }

    public JobComponent getMainJobComponentForPrimaryDemand(PrimaryDemand primaryDemand) {
        return repository.getEntityManager()
                .createQuery("""
                        SELECT jc
                        FROM JobComponent jc
                        WHERE jc.item.id = :itemId
                        AND jc.primarydemand.id = :pdId
                        AND jc.bomLevel = 1
                        """, JobComponent.class)
                .setParameter("itemId", primaryDemand.getItem().getId())
                .setParameter("pdId", primaryDemand.getId())
                .getSingleResult();
    }
}
