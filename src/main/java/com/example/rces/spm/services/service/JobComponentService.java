package com.example.rces.spm.services.service;

import com.example.rces.spm.models.JobComponent;
import com.example.rces.spm.models.JobStep;
import com.example.rces.spm.services.SPMRepository;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class JobComponentService {
    private final SPMRepository repository;

    public JobComponentService(SPMRepository repository) {
        this.repository = repository;
    }

    public List<JobComponent> getChildJobComponents(Long parentJobComponentId) {
        return repository.getEntityManager()
                .createQuery("""
                        SELECT childComponent FROM JobComponent childComponent
                        WHERE childComponent.parentJobComponent.id = :parentJobComponentId
                        """, JobComponent.class)
                .setParameter("parentJobComponentId", parentJobComponentId)
                .getResultList();
    }

//    public Map<JobComponent, Boolean> getChildJobComponentAndHasChildOrJobSteps(Long parentJobComponentId) {
//        return repository.getEntityManager()
//                .createQuery("""
//                    SELECT childComponent,
//                    (SELECT CASE WHEN COUNT(*) > 0 THEN true ELSE false END,
//                    childComponent.jobstep
//                     FROM JobComponent subJc
//                     WHERE subJc.parentJobComponent.id = childComponent.id
//                     OR EXISTS (SELECT 1 FROM JobStep subJs
//                               WHERE subJs.jobcomponent.id = subJc.id))
//                    FROM JobComponent childComponent
//                    LEFT JOIN FETCH childComponent.jobstep
//                    WHERE childComponent.parentJobComponent.id = :parentJobComponentId
//                    """, Object[].class)
//                .setParameter("parentJobComponentId", parentJobComponentId)
//                .getResultStream()
//                .collect(Collectors.toMap(r -> (JobComponent) r[0], r -> (Boolean) r[1]));
//    }

    public Pair<Map<JobComponent, Boolean>, List<JobStep>> getChildJobComponentAndHasChildOrJobStepsAndCurrentJobSteps(Long parentJobComponentId) {
        List<Object[]> results = repository.getEntityManager()
                .createQuery("""
                        SELECT childComponent,
                               (SELECT CASE WHEN COUNT(subJc) > 0 THEN true ELSE false END
                                FROM JobComponent subJc
                                WHERE subJc.parentJobComponent.id = childComponent.id)
                        FROM JobComponent childComponent
                        WHERE childComponent.parentJobComponent.id = :parentJobComponentId
                        """, Object[].class)
                .setParameter("parentJobComponentId", parentJobComponentId)
                .getResultList();
        List<JobStep> jobSteps = repository.getEntityManager().createQuery(
                "select e from JobStep e where e.jobcomponent.id =:id" , JobStep.class)
                .setParameter("id", parentJobComponentId)
                .getResultList();

        Map<JobComponent, Boolean> map = results.stream()
                .collect(Collectors.toMap(
                        result -> (JobComponent) result[0],
                        result -> (Boolean) result[1]
                ));

        return Pair.of(map, jobSteps);
    }

    public List<Boolean> jobComponentHasChildOrHasJobSteps(List<Long> jobComponentIdList) {
        Map<Long, Boolean> results = repository.getEntityManager().createQuery("""
                        SELECT e.id,
                        CASE WHEN (COUNT(jc) > 0 OR COUNT(js) > 0) THEN true ELSE false END
                                FROM JobComponent e
                                LEFT JOIN JobComponent jc ON jc.parentJobComponent.id = e.id
                                LEFT JOIN JobStep js ON js.jobcomponent.id = e.id
                                WHERE e.id IN :ids
                                GROUP BY e.id
                        """, Object[].class)
                .setParameter("ids", jobComponentIdList)
                .getResultStream()
                .collect(Collectors.toMap(r -> (Long) r[0], r -> (Boolean) r[1]));
        return jobComponentIdList.stream()
                .map(id -> results.getOrDefault(id, false))
                .collect(Collectors.toList());
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
