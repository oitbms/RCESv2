package com.example.rces.spm.services.service;

import com.example.rces.spm.models.JobComponent;
import com.example.rces.spm.models.JobStep;
import com.example.rces.spm.services.SPMRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class JobComponentService {
    private final SPMRepository repository;

    public JobComponentService(SPMRepository repository) {
        this.repository = repository;
    }

    public List<JobComponent> getChildComponents(JobComponent parentJobComponent) {
        return repository.getEntityManager()
                .createQuery("""
                        select childComponent from JobComponent childComponent
                        where childComponent.parentJobComponent.id = :parentJobComponentId
                        """, JobComponent.class)
                .setParameter("parentJobComponentId", parentJobComponent.getId())
                .getResultList();
    }

}
