package com.example.rces.spm.controller;

import com.example.rces.spm.controller.payload.JobComponentPayload;
import com.example.rces.spm.controller.payload.JobStepPayload;
import com.example.rces.spm.controller.payload.PrimaryDemandPayload;
import com.example.rces.spm.controller.payload.SPMCustomerOrderPayload;
import com.example.rces.spm.models.JobComponent;
import com.example.rces.spm.models.PrimaryDemand;
import com.example.rces.spm.models.SPMCustomerOrder;
import com.example.rces.spm.services.SPMService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/spm-api")
public class SPMApiController {

    private final SPMService service;

    @Autowired
    public SPMApiController(SPMService service) {
        this.service = service;
    }

    @GetMapping("/getBurningAndAllCustomerOrder")
    @ResponseBody
    public ResponseEntity<Map<String, List<SPMCustomerOrderPayload>>> getBurningTenCustomerOrders() {
        Map<List<SPMCustomerOrder>, List<SPMCustomerOrder>> rawData =
                service.getCustomerOrderService().getFirst10BurningCustomerOrderAndAll();
        List<SPMCustomerOrder> burning = rawData.keySet().iterator().next();
        List<SPMCustomerOrder> all = rawData.values().iterator().next();
        return ResponseEntity.ok(Map.of(
                "burning", burning.stream().map(SPMCustomerOrderPayload::new).toList(),
                "all", all.stream().map(SPMCustomerOrderPayload::new).toList()
        ));
    }

    @GetMapping("/getPrimaryDemandForCustomerOrderId")
    @ResponseBody
    public ResponseEntity<List<PrimaryDemandPayload>> getPrimarydemandForCustomerOrderId(
            @RequestParam Long customerOrderId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "85") int size) {
        Long totalCount = service.getEntityManager().createQuery(
                        "select count(e.id) from PrimaryDemand e where e.customerorder.id = :id", Long.class)
                .setParameter("id", customerOrderId).getSingleResult();

        //native потому что тупорылый PostgreSQL
        List<PrimaryDemand> primaryDemandList = service.getEntityManager()
                .createNativeQuery("select e.id from dm_primarydemand e where e.customerorder_id = :id order by e.demand_type LIMIT :limit OFFSET :offset", Long.class)
                .setParameter("id", customerOrderId)
                .setParameter("limit", size)
                .setParameter("offset", (page - 1) * size)
                .getResultList()
                .stream()
                .map(pd -> service.findById(PrimaryDemand.class, pd))
                .toList();

        List<PrimaryDemandPayload> result = primaryDemandList
                .stream()
                .map(pd -> new PrimaryDemandPayload(pd.getId(), pd.getStormSingleString(),
                        new JobComponentPayload(service.getPrimaryDemandService().getMainJobComponentForPrimaryDemand(pd))))
                .toList();

        return ResponseEntity.ok()
                .header("X-Total-Count", String.valueOf(totalCount))
                .header("X-Page", String.valueOf(page))
                .header("X-Page-Size", String.valueOf(size))
                .contentType(MediaType.APPLICATION_JSON)
                .body(result);
    }

//    @GetMapping("/getMainJobComponentForPrimaryDemandId")
//    @ResponseBody
//    public ResponseEntity<JobComponentPayload> getMainJobComponentForPrimaryDemandId(Long primaryDemandId) {
//        JobComponent jobComponent = service.getPrimaryDemandService()
//                .getMainJobComponentForPrimaryDemand(service.findById(PrimaryDemand.class, primaryDemandId));
//        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON)
//                .body(new JobComponentPayload(jobComponent));
//    }

    @GetMapping("/getChildJobComponentForJobcomponentId")
    @ResponseBody
    public ResponseEntity<List<JobComponentPayload>> getChildJobComponentForJobcomponentId(Long jobComponentId) {
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON)
                .body(
                        service.getJobComponentService().getChildJobComponents(service.findById(JobComponent.class, jobComponentId))
                                .stream()
                                .map(JobComponentPayload::new)
                                .toList()
                );
    }


    @GetMapping("/getJobStepsForJobComponentId")
    @ResponseBody
    public ResponseEntity<List<JobStepPayload>> getJobStepsForJobComponentId(Long jobComponentId) {
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON)
                .body(service.findById(JobComponent.class, jobComponentId).getJobSteps()
                        .stream()
                        .map(JobStepPayload::new)
                        .toList()
                );
    }

}
