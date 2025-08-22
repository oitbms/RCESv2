package com.example.rces.controller.api;

import com.example.rces.controller.api.service.ApiSGIService;
import com.example.rces.controller.payload.ExecutionsPayload;
import com.example.rces.controller.payload.ImagesPayload;
import com.example.rces.controller.payload.SGIPayload;
import com.example.rces.models.FactExecutionSGI;
import com.example.rces.models.SGI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/sgi")
public class ApiSGIController {

    private final ApiSGIService service;

    @Autowired
    public ApiSGIController(ApiSGIService service) {
        this.service = service;
    }

    @GetMapping("/executions")
    public ResponseEntity<List<ExecutionsPayload>> getExecutions(@RequestParam UUID param) {
        List<FactExecutionSGI> executions = service.getExecutions(param);
        return ResponseEntity.ok(executions.stream()
                .map(ExecutionsPayload::new)
                .collect(Collectors.toList()));
    }

    @GetMapping("/get-page-sgi")
    @ResponseBody
    public ResponseEntity<Page<SGIPayload>> getPageSGI(@RequestParam int page, @RequestParam int size) {
        Page<SGI> pageSgi = service.getPage(page, size);
        Page<SGIPayload> sgiPayloadPage = pageSgi.map(SGIPayload::new);
        return ResponseEntity.ok().body(sgiPayloadPage);
    }

    @GetMapping("/get-sgi")
    public ResponseEntity<SGIPayload> getSgi(@RequestParam UUID id) {
        SGI sgi = service.getSgi(id);
        return ResponseEntity.ok(new SGIPayload(sgi));
    }

    @GetMapping("/images")
    public List<ImagesPayload> getImages(@RequestParam UUID param) {
        return service.findImages(param);
    }

}
