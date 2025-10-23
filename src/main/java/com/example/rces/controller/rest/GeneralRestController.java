package com.example.rces.controller.rest;

import com.example.rces.dto.CustomerOrderDTO;
import com.example.rces.dto.EmployeeDTO;
import com.example.rces.dto.InconsistencyDto;
import com.example.rces.dto.SubDivisionDTO;
import com.example.rces.models.Employee;
import com.example.rces.models.enums.GeneralReason;
import com.example.rces.models.enums.Item;
import com.example.rces.models.enums.Status;
import com.example.rces.payload.ReasonPayload;
import com.example.rces.service.CustomerOrderService;
import com.example.rces.service.EmployeeService;
import com.example.rces.service.InconsistenciesService;
import com.example.rces.service.SubDivisionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class GeneralRestController {

    private final InconsistenciesService inconsistenciesService;
    private final CustomerOrderService customerOrderService;
    private final EmployeeService employeeService;
    private final SubDivisionService subDivisionService;

    @Autowired
    public GeneralRestController(CustomerOrderService customerOrderService, EmployeeService employeeService, InconsistenciesService inconsistenciesService, SubDivisionService subDivisionService) {
        this.customerOrderService = customerOrderService;
        this.employeeService = employeeService;
        this.inconsistenciesService = inconsistenciesService;
        this.subDivisionService = subDivisionService;
    }

    @GetMapping("/employees")
    public List<EmployeeDTO> getEmployees(@RequestParam(required = false) Object param) {
        if (param != null) {
            return employeeService.findAllByRole((String) param);
        } else {
            return employeeService.findAll();
        }
    }

    @GetMapping("/updater")
    @ResponseBody
    public Employee getUpdater() {
        return employeeService.getCurrentUser();
    }

    @GetMapping("/customer-orders")
    public List<CustomerOrderDTO> getCustomerOrders() {
        return customerOrderService.findAllPayload();
    }

    @GetMapping("/reasons")
    public List<ReasonPayload> getReasons(@RequestParam String param) {
        return Arrays.stream(GeneralReason.values())
                .filter(reason -> reason.getRequestType().equals(param))
                .map(reason -> new ReasonPayload(reason.getName()))
                .collect(Collectors.toList());
    }

    @GetMapping("/inconsistency")
    public List<InconsistencyDto> getInconsistency(@RequestParam String param) {
        return inconsistenciesService.findAllByType(param);
    }

    @GetMapping("/item")
    public List<Item> getItems() {
        return Arrays.stream(Item.values())
                .collect(Collectors.toList());
    }

    @GetMapping("/status")
    public List<Status> getStatus(@RequestParam String param) {
        return switch (param) {
            case "ADMIN" -> Arrays.asList(Status.values());
            case "OTK", "CONSTRUCTOR", "TECHNOLOGIST" -> Arrays.asList(Status.InWork, Status.Completed);
            case "MASTER" -> Arrays.asList(Status.Closed, Status.Cancel);
            default -> Collections.emptyList();
        };
    }

    @GetMapping("/sub-divisions")
    public List<SubDivisionDTO> getSubDivisions() {
        return subDivisionService.getAll();
    }
}
