package com.example.rces.controller;

import com.example.rces.controller.payload.*;
import com.example.rces.models.*;
import com.example.rces.models.enums.*;
import com.example.rces.services.ApiServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

import static com.example.rces.services.ServiceUtil.formatedDate;

@RestController
@RequestMapping("/api")
public class ApiController {

    private final ApiServices service;

    @Autowired
    public ApiController(ApiServices service) {
        this.service = service;
    }

    @GetMapping("/employees")
    public List<Employee> getEmployees(@RequestParam Object param) {
        return service.findAllEmployees(param);
    }

    @GetMapping("/customerOrders")
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

    @GetMapping("/mlmNode")
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

    @GetMapping("/images")
    public List<ImagesPayload> getImages(@RequestParam UUID param) {
        return service.findImages(param);
    }

    @PostMapping("/inwork")
    public void inWork(@RequestParam UUID param,
                       @RequestParam(required = false) String description,
                       @RequestParam(required = false) Boolean status) {
        service.getRequest(param, description, status);
    }

    @PostMapping("/update")
    public void updateData(@RequestParam String bidType,// Имя класса bid
                           @RequestParam UUID id, // id класса bid
                           @RequestParam(required = false) Boolean sendMessage, // отправлять сообщение в ТГ
                           @RequestBody Map<String, Object> updatedFields) // ключ - название поля в классе bid, значение - значение поля в bid
    {
        service.update(id, sendMessage, updatedFields);
    }

    @GetMapping("/typeRequest")
    @ResponseBody
    public String getTypeRequest(@RequestParam UUID param) {
        return "\"" + service.getTypeRequest(param) + "\"";
    }

    @GetMapping("/updater")
    @ResponseBody
    public Employee getUpdater() {
        return service.getUpdater();
    }

    @GetMapping("/logs")
    public ResponseEntity<List<LogPayload>> getLogs(@RequestParam UUID id) {
        List<RequestLog> logs = service.getLogs(id);
        return ResponseEntity.ok(logs.stream()
                .map(log -> new LogPayload(log.getDate(), log.getUser().getName(), log.getMetadata()))
                .sorted(Comparator.comparing(LogPayload::date))
                .toList());
    }

    @GetMapping("/executions")
    public ResponseEntity<List<ExecutionsPayload>> getExecutions(@RequestParam UUID param) {
        List<FactExecutionSGI> executions = service.getExecutions(param);
        return ResponseEntity.ok(executions.stream()
                .map(ex -> new ExecutionsPayload(ex.getId(), ex.getExecutionDate().format(DateTimeFormatter.ofPattern("dd.MM.yyyy")), ex.getReport()))
                .collect(Collectors.toList()));
    }

    @GetMapping("/sgi")
    public ResponseEntity<SingleSgi> getSgi(@RequestParam UUID id) {
        SGI sgi = service.getSgi(id);
        return ResponseEntity.ok(new SingleSgi(sgi.getId(), sgi.getWorkShop(), sgi.getEvent(), sgi.getActions(), sgi.getDepartment().name(), sgi.getDepartment().getName(), sgi.getEmployee().getName(), sgi.getDesiredDate(), sgi.getPlanDate(), sgi.getNote(), sgi.getAgreed(), !sgi.getExecutions().isEmpty()));
    }

    @GetMapping("/print")
    public ResponseEntity<Resource> printManySgi(@RequestParam List<UUID> ids) {
        try {
            List<SGI> sgiList = service.getSgiList(ids).stream().sorted(Comparator.comparing(SGI::getRequestNumber)).collect(Collectors.toList());
            ByteArrayResource resource = service.generateManyWordFile(sgiList);

            String filename = "Мероприятия_" + formatedDate(LocalDate.now()) + ".docx";
            String encodedFilename = URLEncoder.encode(filename, StandardCharsets.UTF_8.toString())
                    .replace("+", "%20");

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename*=UTF-8''" + encodedFilename)
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .contentLength(resource.contentLength())
                    .body(resource);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
}