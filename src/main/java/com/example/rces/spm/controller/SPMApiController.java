package com.example.rces.spm.controller;

import com.example.rces.spm.controller.payload.JobComponentPayload;
import com.example.rces.spm.controller.payload.JobStepPayload;
import com.example.rces.spm.controller.payload.PrimaryDemandPayload;
import com.example.rces.spm.controller.payload.SPMCustomerOrderPayload;
import com.example.rces.spm.models.*;
import com.example.rces.spm.services.SPMService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/spm-api")
public class SPMApiController {

    private final SPMService service;

    @Autowired
    public SPMApiController(SPMService service) {
        this.service = service;
    }

    @GetMapping("/getBurningCustomerOrder")
    @ResponseBody
    public ResponseEntity<List<SPMCustomerOrderPayload>> getBurningTenCustomerOrders() {
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON)
                .body(
                        service.getCustomerOrderService().getFirst10BurningCustomerOrder()
                                .stream().map(co -> new SPMCustomerOrderPayload(co.getId(), co.getStrCode()))
                                .toList());
    }

    @GetMapping("/getAllCustomerOrder")
    @ResponseBody
    public ResponseEntity<List<SPMCustomerOrderPayload>> getAllCustomerOrders() {
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON)
                .body(
                        service.findAll(SPMCustomerOrder.class)
                                .stream()
                                .map(co -> new SPMCustomerOrderPayload(co.getId(), co.getStrCode())).toList());
    }

    @GetMapping("/getPrimaryDemandForCustomerOrderId")
    @ResponseBody
    public ResponseEntity<List<PrimaryDemandPayload>> getPrimarydemandForCustomerOrderId(Long customerOrderId) {
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON)
                .body(
                        service.findAllByField(PrimaryDemand.class, "customerorder",
                                        service.findById(SPMCustomerOrder.class, customerOrderId),null)
                                .stream()
                                .sorted(Comparator.comparing(pd -> {
                                    if (pd instanceof CustomerOrderLine customerOrderLine) {
                                        return customerOrderLine.getNumber();
                                    } else if (pd instanceof PurchaseOrderLine purchaseOrderLine) {
                                        return purchaseOrderLine.getNumber();
                                    } else {
                                        return Integer.parseInt(((JobOrder) pd).strCode);
                                    }
                                }))
                                .map(pd -> new PrimaryDemandPayload(pd.getId(), pd.getStormSingleString()))
                                .toList());
    }

    @GetMapping("/getMainJobComponentForPrimaryDemandId")
    @ResponseBody
    public ResponseEntity<JobComponentPayload> getMainJobComponentForPrimaryDemandId(Long primaryDemandId) {
        JobComponent jobComponent = service.getPrimaryDemandService()
                .getMainJobComponentForPrimaryDemand(service.findById(PrimaryDemand.class, primaryDemandId));
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON)
                .body(new JobComponentPayload(jobComponent));
    }

    @GetMapping("/getChildJobComponentForJobcomponentId")
    @ResponseBody
    public ResponseEntity<List<JobComponentPayload>> getChildJobComponentForJobcomponentId(Long jobComponentId) {
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON)
                .body(
                        service.getJobComponentService().getChildComponents(service.findById(JobComponent.class, jobComponentId))
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
