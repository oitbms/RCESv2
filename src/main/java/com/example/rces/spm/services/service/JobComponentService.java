package com.example.rces.spm.services.service;

import com.example.rces.spm.models.JobComponent;
import com.example.rces.spm.services.SPMRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobComponentService {
    private final SPMRepository repository;

    public JobComponentService(SPMRepository repository) {
        this.repository = repository;
    }

    public List<JobComponent> getChildJobComponents(JobComponent parentJobComponent) {
        return repository.getEntityManager()
                .createQuery("""
                        select childComponent from JobComponent childComponent
                        where childComponent.parentJobComponent.id = :parentJobComponentId
                        """, JobComponent.class)
                .setParameter("parentJobComponentId", parentJobComponent.getId())
                .getResultList();
    }

    public List<JobComponent> getAllChildJobComponents(Long parentJobComponentId) {
        return repository.getEntityManager()
                .createNativeQuery("""
                        with recursive childs as (
                            select id, primarydemand_id, jobstep_id, number, item_id, unitmeasure_id, qty_demand, qty_required, qty_finished, bom_level,
                            qty_bom, parent_jobcomponent_id, date_start, date_calc_end
                            from jm_jobcomponent
                            where id = :parentJobComponentId
                            union all
                            select  jc.id, jc.primarydemand_id, jc.jobstep_id, jc.number, jc.item_id, jc.unitmeasure_id, jc.qty_demand, jc.qty_required,
                                    jc.qty_finished,jc.bom_level, jc.qty_bom, jc.parent_jobcomponent_id, jc.date_start, jc.date_calc_end
                            from jm_jobcomponent jc
                            inner join childs t on jc.parent_jobcomponent_id = t.id
                        )
                        select id, primarydemand_id, jobstep_id, number, item_id, unitmeasure_id, qty_demand, qty_required, qty_finished, bom_level,
                               qty_bom, parent_jobcomponent_id, date_start, date_calc_end
                        from childs
                        where id != :parentJobComponentId
                        """, JobComponent.class)
                .setParameter("parentJobComponentId", parentJobComponentId)
                .getResultList();
    }


}
