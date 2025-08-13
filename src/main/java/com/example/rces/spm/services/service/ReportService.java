package com.example.rces.spm.services.service;

import com.example.rces.spm.controller.payload.JobComponentPayload;
import com.example.rces.spm.controller.payload.JobStepPayload;
import com.example.rces.spm.controller.payload.PrimaryDemandPayload;
import com.example.rces.spm.models.JobComponent;
import com.example.rces.spm.models.JobStep;
import com.example.rces.spm.models.PrimaryDemand;
import com.example.rces.spm.services.SPMRepository;
import com.example.rces.utils.TreeNode;
import org.apache.commons.collections4.list.TreeList;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.example.rces.utils.ExcelExporter.exportToExcelTree;

@Service
public class ReportService {
    private final SPMRepository spmRepository;
    private final PrimaryDemandService primaryDemandService;
    private final JobComponentService jobComponentService;

    public ReportService(SPMRepository spmRepository, PrimaryDemandService primaryDemandService, JobComponentService jobComponentService) {
        this.spmRepository = spmRepository;
        this.primaryDemandService = primaryDemandService;
        this.jobComponentService = jobComponentService;
    }


    public ByteArrayResource makeCustomerOrderTreeReport(Long customerOrderId) throws Exception {
        List<PrimaryDemand> primaryDemandList = spmRepository.getEntityManager().createQuery(
                        """
                                select e from PrimaryDemand e where e.customerorder.id = :id order by e.demandType
                                """, PrimaryDemand.class)
                .setParameter("id", customerOrderId).getResultList();
        Map<PrimaryDemand, JobComponent> pdJcMap = primaryDemandService.getMainJobComponentForPrimaryDemand(primaryDemandList);
        List<PrimaryDemandPayload> primaryDemandPayloadList = primaryDemandList.stream()
                .map(pd -> new PrimaryDemandPayload(pd.getId(), pd.getStormSingleString(), new JobComponentPayload(pdJcMap.get(pd))))
                .toList();

        List<TreeNode> rootNodes = new TreeList<>();
        for (PrimaryDemandPayload pd : primaryDemandPayloadList) {
            TreeNode pdNode = new TreeNode(pd);
            List<JobComponent> allChildJobComponentList = jobComponentService.getAllChildJobComponents(pd.jobComponent().id());

            Map<Long, TreeNode> nodeMap = new HashMap<>();
            List<JobStep> jobStepsList = new ArrayList<>(spmRepository.findById(JobComponent.class, pd.jobComponent().id()).getJobSteps());
            jobStepsList.forEach(js -> nodeMap.put(js.getId(), new TreeNode(new JobStepPayload(js), pd.name(), pd.jobComponent().id())));
            for (JobComponent jc : allChildJobComponentList) {
                JobComponentPayload jcPayload = new JobComponentPayload(jc);
                nodeMap.put(jc.getId(), new TreeNode(jcPayload, pd.name(), jcPayload.parentId()));
                jc.getJobSteps().forEach(js -> nodeMap.put(js.getId(), new TreeNode(new JobStepPayload(js), pd.name(), jcPayload.id())));
                jobStepsList.addAll(jc.getJobSteps());
            }

            allChildJobComponentList.forEach(jc -> {
                TreeNode currentNode = nodeMap.get(jc.getId());
                Long parentId = jc.getParentJobComponent() != null ? jc.getParentJobComponent().getId() : null;
                if (parentId != null && nodeMap.containsKey(parentId)) {
                    nodeMap.get(parentId).addChild(currentNode);
                } else {
                    pdNode.addChild(currentNode);
                }
            });
            jobStepsList.forEach(js -> {
                TreeNode currentNode = nodeMap.get(js.getId());
                Long parentId = currentNode.parentId;

                if (parentId != null && nodeMap.containsKey(parentId)) {
                    nodeMap.get(parentId).addChild(currentNode);
                } else {
                    pdNode.addChild(currentNode);
                }
            });

            rootNodes.add(pdNode);
        }

        return exportToExcelTree(rootNodes,
                Map.ofEntries(
                        Map.entry("Строка ЗК/Спрос", 70 * 256),
                        Map.entry("ДСЕ", 60 * 256),
                        Map.entry("Узел ПЛМ", 35 * 256),
                        Map.entry("Описание(заход)", 40 * 256),
                        Map.entry("План брутто", 12 * 256),
                        Map.entry("Выполнено", 14 * 256),
                        Map.entry("Трудоемкость", 14 * 256),
                        Map.entry("Дата начала", 12 * 256),
                        Map.entry("Дата завершения", 16 * 256),
                        Map.entry("РД начала", 14 * 256),
                        Map.entry("РД завершения", 15 * 256)
                ));
    }

}
