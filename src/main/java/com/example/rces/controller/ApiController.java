package com.example.rces.controller;

import com.example.rces.controller.payload.ImagesPayload;
import com.example.rces.controller.payload.ReasonPayload;
import com.example.rces.controller.payload.StatusPayload;
import com.example.rces.models.CustomerOrder;
import com.example.rces.models.Employee;
import com.example.rces.models.GeneralReason;
import com.example.rces.models.enums.Status;
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
        return Arrays.stream(GeneralReason.Technologist.values())
                .map(technologist -> new ReasonPayload(technologist.getId(), technologist.getName()))
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
    public void updateData(@RequestParam Object entityName,// Имя класса bid
                           @RequestParam Object entityId, // id класса bid
                           @RequestParam Boolean sendMessage, // отправлять сообщение в ТГ
                           @RequestBody Map<String, Object> updatedFields) // ключ - название поля в классе bid, значение - значение поля в bid
    {
        service.update(entityName, entityId, sendMessage, updatedFields);
    }

}