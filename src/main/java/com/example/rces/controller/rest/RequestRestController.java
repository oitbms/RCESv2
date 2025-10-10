package com.example.rces.controller.rest;

import com.example.rces.payload.ImagesPayload;
import com.example.rces.models.Employee;
import com.example.rces.models.Inconsistency;
import com.example.rces.models.Requests;
import com.example.rces.service.EmployeeService;
import com.example.rces.service.ImageService;
import com.example.rces.service.InconsistenciesService;
import com.example.rces.service.RequestsService;
import jakarta.ws.rs.ForbiddenException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/request")
public class RequestRestController {

    private final EmployeeService employeeService;
    private final RequestsService requestsService;
    private final ImageService imageService;
    private final InconsistenciesService inconsistenciesService;

    @Autowired
    public RequestRestController(EmployeeService employeeService, RequestsService requestsService, ImageService imageService, InconsistenciesService inconsistenciesService) {
        this.employeeService = employeeService;
        this.requestsService = requestsService;
        this.imageService = imageService;
        this.inconsistenciesService = inconsistenciesService;
    }

    @PostMapping("/in-work")
    public ResponseEntity<?> inWork(@RequestParam UUID param,
                                    @RequestParam(required = false) String description,
                                    @RequestParam(required = false) String status,
                                    @RequestParam(required = false) Integer qtyCompleted,
                                    @RequestParam(required = false) String inconsistencyData
    ) {
        Requests requests = requestsService.findById(param);
        Set<Inconsistency> inconsistencies = Collections.emptySet();
        if (inconsistencyData != null && !inconsistencyData.isEmpty()) {
            try {
                inconsistencies = Inconsistency.fromField(inconsistencyData, new HashSet<>(inconsistenciesService.findAllInconsistencies()));
            } catch (Exception e) {
                throw new RuntimeException("Ошибка парсинга inconsistencyData", e);
            }
        }
        if (status != null && status.equals("closed")) {
            if (qtyCompleted == null || qtyCompleted < 0 || qtyCompleted > requests.getQty()) {
                throw new RuntimeException("Передано некорректное число!");
            }
        }
        try {
            requestsService.save(param, description, status, qtyCompleted, inconsistencies);
            Map<String, String> successMap = new HashMap<>();
            successMap.put("message", String.format("Заявка: %s успешно принята в работу!", requests.getRequestNumber()));
            return ResponseEntity.ok(successMap);
        } catch (ForbiddenException forbiddenException) {
            Map<String, String> errorMap = new HashMap<>();
            errorMap.put("error", forbiddenException.getMessage());
            return ResponseEntity.badRequest().body(errorMap);
        }
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
        updatedFields.remove("qtyCompleted");
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
    public ResponseEntity<?> deleteImages(@RequestBody Map<String, String> payload) {
        UUID imageId = UUID.fromString(payload.get("id"));
        UUID requestId = UUID.fromString(payload.get("reqId"));
        Requests requests = requestsService.findById(requestId);
        Employee currentUser = employeeService.getCurrentUser();
        if (!requests.getEmployee().getName().equals(currentUser.getName())) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Пользователь не может удалять фото в заявке!");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        imageService.deleteById(imageId);
        Map<String, String> messageResponse = new HashMap<>();
        messageResponse.put("message", "Фото успешно удалено!");
        return ResponseEntity.ok(messageResponse);
    }

}
