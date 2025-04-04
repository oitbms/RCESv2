package com.example.rces.controller;

import com.example.rces.controller.payload.*;
import com.example.rces.models.CustomerOrder;
import com.example.rces.models.Employee;
import com.example.rces.models.enums.*;
import com.example.rces.services.ApiServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class ApiController {

    @Autowired
    private ApiServices service;

    @GetMapping("/employees")
    public List<Employee> getEmployees(@RequestParam String param) {
        return service.findAllEmployees(param);
    }

    @GetMapping("/customerOrders")
    public List<CustomerOrder> getCustomerOrders() {
        return service.findAllCustomerOrder();
    }

    @GetMapping("/reasons")
    public List<ReasonPayload> getReasons() {
        return Arrays.stream(GeneralReason.values())
                .map(reason -> new ReasonPayload(reason.getName()))
                .collect(Collectors.toList());
    }

    @GetMapping("/inconsistency")
    public List<InconsistencyPayload> getInconsistency() {
        return Arrays.stream(Inconsistency.values())
                .map(inconsistency -> new InconsistencyPayload(inconsistency.getName()))
                .collect(Collectors.toList());
    }

    @GetMapping("/item")
    public List<ItemPayload> getItems() {
        return Arrays.stream(Item.values())
                .map(item -> new ItemPayload(item.getName()))
                .collect(Collectors.toList());
    }

    @GetMapping("/mlmNode")
    public List<MlmNodePayload> getMlmNode() {
        return Arrays.stream(MlmNode.values())
                .map(mlmNode -> new MlmNodePayload(mlmNode.getName()))
                .collect(Collectors.toList());
    }

    @GetMapping("/status")
    public List<StatusPayload> getStatus() {
        return Arrays.stream(Status.values())
                .map(status -> new StatusPayload(status.getId(), status.getName()))
                .collect(Collectors.toList());
    }

    @GetMapping("/images")
    public List<ImagesPayload> getImages(@RequestParam UUID param) {
        return service.findImages(param);
    }

    @PostMapping("/update")
    public void updateData(@RequestParam String bidType,// Имя класса bid
                           @RequestParam UUID id, // id класса bid
                           @RequestParam(required = false) Boolean sendMessage, // отправлять сообщение в ТГ
                           @RequestBody Map<String, Object> updatedFields) // ключ - название поля в классе bid, значение - значение поля в bid
    {
        service.update(bidType, id, sendMessage, updatedFields);
    }

    @GetMapping("/typeRequest")
    @ResponseBody
    public String getTypeRequest(@RequestParam UUID param) {
        return "\"" + service.getTypeRequest(param) + "\"";
    }

}