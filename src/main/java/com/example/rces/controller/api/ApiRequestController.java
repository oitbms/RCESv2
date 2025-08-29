package com.example.rces.controller.api;

import com.example.rces.controller.payload.ImagesPayload;
import com.example.rces.controller.payload.LogPayload;
import com.example.rces.models.Employee;
import com.example.rces.models.Requests;
import com.example.rces.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/request")
public class ApiRequestController {

    private final EmployeeService employeeService;
    private final RequestsService requestsService;
    private final RequestLogService requestLogService;
    private final ImageService imageService;

    @Autowired
    public ApiRequestController(EmployeeService employeeService, RequestsService requestsService, RequestLogService requestLogService, ImageService imageService) {
        this.employeeService = employeeService;
        this.requestsService = requestsService;
        this.requestLogService = requestLogService;
        this.imageService = imageService;
    }

    @PostMapping("/in-work")
    public void inWork(@RequestParam UUID param,
                       @RequestParam(required = false) String description,
                       @RequestParam(required = false) Boolean status) {
        requestsService.save(param, description, status);
    }

    @GetMapping("/type-request")
    @ResponseBody
    public String getTypeRequest(@RequestParam UUID param) {
        return "\"" + requestsService.getTypeRequest(param) + "\"";
    }


    @PostMapping("/update")
    public void updateData(@RequestParam String bidType,// Имя класса bid
                           @RequestParam UUID id, // id класса bid
                           @RequestParam(required = false) Boolean sendMessage, // отправлять сообщение в ТГ
                           @RequestBody Map<String, Object> updatedFields) // ключ - название поля в классе bid, значение - значение поля в bid
    {
        requestsService.update(id, sendMessage, updatedFields);
    }

    @PostMapping("/comment-bid")
    public void createCommentBid(@RequestParam UUID id, @RequestParam String comment) {
        requestsService.createComment(id, comment);
    }

    @GetMapping("/images")
    public List<ImagesPayload> getImages(@RequestParam UUID param) {
        return imageService.getImagesByRequestId(param);
    }

    @DeleteMapping("/delete-images")
    public ResponseEntity<Void> deleteImages(@RequestBody Map<String, String> payload) {
        UUID imageId = UUID.fromString(payload.get("id"));
        UUID requestId = UUID.fromString(payload.get("reqId"));
        Requests requests = requestsService.findById(requestId);
        Employee currentUser = employeeService.getCurrentUser();
        if (!requests.getEmployee().getName().equals(currentUser.getName())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Пользователь не может удалять фото!");
        }
        imageService.deleteById(imageId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/logs")
    public ResponseEntity<List<LogPayload>> getLogs(@RequestParam UUID id) {
        List<LogPayload> logs = requestLogService.getAllByRequestId(id);
        return ResponseEntity.ok(logs);
    }
}
