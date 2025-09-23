package com.example.rces.controller.api;

import com.example.rces.models.Inconsistency;
import com.example.rces.service.InconsistenciesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/inconsistencies")
@Validated
public class InconsistenciesController {

    InconsistenciesService inconsistenciesService;

    @Autowired
    public InconsistenciesController(InconsistenciesService inconsistenciesService) {
        this.inconsistenciesService = inconsistenciesService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestParam String name,
                                    @RequestParam String typeControl) {
        try {
            Inconsistency inconsistency = inconsistenciesService.createInconsistency(name, typeControl);
            return ResponseEntity.ok(inconsistency);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}
