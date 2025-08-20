package com.example.rces.controller.api;

import com.example.rces.controller.api.service.ApiService;
import com.example.rces.controller.payload.*;
import com.example.rces.models.CustomerOrder;
import com.example.rces.models.Employee;
import com.example.rces.models.enums.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class ApiController {

    private final ApiService service;

    @Autowired
    public ApiController(ApiService service) {
        this.service = service;
    }

    @GetMapping("/employees")
    public List<EmployeePayload> getEmployees(@RequestParam(required = false) Object param) {
        List<Employee> employees = service.findAllEmployees(param);
        return employees.stream().map(EmployeePayload::new).toList();
    }

    @GetMapping("/updater")
    @ResponseBody
    public Employee getUpdater() {
        return service.getUpdater();
    }

    @GetMapping("/customer-orders")
    public List<CustomerOrder> getCustomerOrders() {
        return service.findAllCustomerOrder();
    }

    @GetMapping("/reasons")
    public List<ReasonPayload> getReasons(@RequestParam String param) {
        return Arrays.stream(GeneralReason.values())
                .filter(reason -> reason.getRequestType().equals(param))
                .map(reason -> new ReasonPayload(reason.getName()))
                .collect(Collectors.toList());
    }

    @GetMapping("/inconsistency")
    public List<InconsistencyPayload> getInconsistency(@RequestParam String param) {
        return Arrays.stream(Inconsistency.values())
                .filter(req -> req.getControlType().equals(param))
                .map(inconsistency -> new InconsistencyPayload(inconsistency.getName()))
                .collect(Collectors.toList());
    }

    @GetMapping("/item")
    public List<ItemPayload> getItems() {
        return Arrays.stream(Item.values())
                .map(item -> new ItemPayload(item.getName()))
                .collect(Collectors.toList());
    }

    @GetMapping("/mlm-node")
    public List<MlmNodePayload> getMlmNode() {
        return Arrays.stream(MlmNode.values())
                .map(mlmNode -> new MlmNodePayload(mlmNode.getName()))
                .collect(Collectors.toList());
    }

    @GetMapping("/status")
    public List<StatusPayload> getStatus(@RequestParam String param) {
        List<Status> statuses = switch (param) {
            case "ADMIN" -> Arrays.asList(Status.values());
            case "OTK", "CONSTRUCTOR", "TECHNOLOGIST" -> Arrays.asList(Status.InWork, Status.Completed);
            case "MASTER" -> Arrays.asList(Status.Closed, Status.Cancel);
            default -> Collections.emptyList();
        };
        return statuses.stream()
                .map(status -> new StatusPayload(status.getId(), status.getName()))
                .collect(Collectors.toList());
    }
}
