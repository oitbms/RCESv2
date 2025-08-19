package com.example.rces.controller.api;

import com.example.rces.controller.api.service.ApiRequestService;
import com.example.rces.controller.payload.ImagesPayload;
import com.example.rces.controller.payload.LogPayload;
import com.example.rces.models.RequestLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/request")
public class ApiRequestController {

    private final ApiRequestService service;

    @Autowired
    public ApiRequestController(ApiRequestService service) {
        this.service = service;
    }

    @PostMapping("/in-work")
    public void inWork(@RequestParam UUID param,
                       @RequestParam(required = false) String description,
                       @RequestParam(required = false) Boolean status) {
        service.getRequest(param, description, status);
    }

    @GetMapping("/type-request")
    @ResponseBody
    public String getTypeRequest(@RequestParam UUID param) {
        return "\"" + service.getTypeRequest(param) + "\"";
    }


    @PostMapping("/update")
    public void updateData(@RequestParam String bidType,// Имя класса bid
                           @RequestParam UUID id, // id класса bid
                           @RequestParam(required = false) Boolean sendMessage, // отправлять сообщение в ТГ
                           @RequestBody Map<String, Object> updatedFields) // ключ - название поля в классе bid, значение - значение поля в bid
    {
        service.update(id, sendMessage, updatedFields);
    }

    @PostMapping("/comment-bid")
    public void createCommentBid(@RequestParam UUID id, @RequestParam String comment) {
        service.createCommentBid(id, comment);
    }

    @GetMapping("/images")
    public List<ImagesPayload> getImages(@RequestParam UUID param) {
        return service.findImages(param);
    }

    @DeleteMapping("/delete-images")
    public ResponseEntity<?> deleteImages(@RequestBody Map<String, String> payload) {
        try {
            service.deleteImages(UUID.fromString(payload.get("id")), UUID.fromString(payload.get("reqId")));
            return ResponseEntity.ok().build();
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/logs")
    public ResponseEntity<List<LogPayload>> getLogs(@RequestParam UUID id) {
        List<RequestLog> logs = service.getLogs(id);
        return ResponseEntity.ok(logs.stream()
                .map(log -> new LogPayload(log.getDate(), log.getUser().getName(), log.getMetadata()))
                .sorted(Comparator.comparing(LogPayload::date))
                .toList());
    }

//    @PostMapping("/pause")
//    public void pause(@RequestParam UUID id, @RequestParam String startTime,
//                      @RequestParam String endTime, @RequestParam String pauseComment) {
//        service.pauseBid(id,
//                LocalTime.parse(startTime, DateTimeFormatter.ofPattern("HH:mm")),
//                LocalTime.parse(endTime, DateTimeFormatter.ofPattern("HH:mm")),
//                pauseComment);
//    }

}
