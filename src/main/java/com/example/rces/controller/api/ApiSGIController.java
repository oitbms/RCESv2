package com.example.rces.controller.api;

import com.example.rces.controller.payload.ImagesPayload;
import com.example.rces.controller.payload.SGIPayload;
import com.example.rces.models.SGI;
import com.example.rces.service.ImageService;
import com.example.rces.service.SgiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextException;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/sgi")
public class ApiSGIController {

    private final SgiService sgiService;
    private final ImageService imageService;

    @Autowired
    public ApiSGIController(SgiService sgiService, ImageService imageService) {
        this.sgiService = sgiService;
        this.imageService = imageService;
    }

    @PostMapping("/create")
    public ResponseEntity<SGIPayload> createSGI(@RequestParam String workcenter,
                                                @RequestParam String event,
                                                @RequestParam String actions,
                                                @RequestParam String department,
                                                @RequestParam String employee,
                                                @RequestParam(required = false) LocalDate desiredDate,
                                                @RequestParam(required = false) String note,
                                                @RequestParam(required = false) MultipartFile[] additionalFiles,
                                                @RequestParam(required = false) String parentId) {
        SGIPayload newSGi = sgiService.createSGI(workcenter, event, actions, department, desiredDate, note, employee, additionalFiles, parentId);
        return ResponseEntity.ok(newSGi);
    }

    @PatchMapping("/update")
    public ResponseEntity<SGIPayload> updateSGI(@RequestParam UUID id,
                                                @RequestParam(required = false) String workcenter,
                                                @RequestParam(required = false) String event,
                                                @RequestParam(required = false) String actions,
                                                @RequestParam(required = false) String department,
                                                @RequestParam(required = false) LocalDate desiredDate,
                                                @RequestParam(required = false) LocalDate planDate,
                                                @RequestParam(required = false) String employee,
                                                @RequestParam(required = false) String note,
                                                @RequestParam Boolean factExecutionSGIBool,
                                                @RequestParam(required = false) LocalDate executionDate,
                                                @RequestParam(required = false) String report,
                                                @RequestParam(required = false) MultipartFile[] imagesSGI,
                                                @RequestParam(required = false) MultipartFile[] imagesFactSGI) throws CloneNotSupportedException {
        SGI sgi = sgiService.findById(id).orElseThrow(() -> new ApplicationContextException("Передан null в id SGI на сохранение изменений"));
        SGIPayload updateSGI = sgiService.save(sgi, workcenter, event, actions, department, desiredDate, planDate,
                employee, note, executionDate, factExecutionSGIBool, executionDate, report, imagesSGI, imagesFactSGI);
        return ResponseEntity.ok(updateSGI);
    }

    @GetMapping("/get-page-sgi")
    @ResponseBody
    public ResponseEntity<Page<SGIPayload>> getPageSGI(@RequestParam int page, @RequestParam int size) {
        Page<SGIPayload> pageSgiPayload = sgiService.getPage(page, size);
        return ResponseEntity.ok()
                .header("X-Total-Count", String.valueOf(pageSgiPayload.getTotalElements()))
                .contentType(MediaType.APPLICATION_JSON)
                .body(pageSgiPayload);
    }

    @GetMapping("/get-images-sgi")
    @ResponseBody
    public ResponseEntity<List<ImagesPayload>> getImagesForSgiId(@RequestParam UUID id) {
        List<ImagesPayload> imagesPayload = imageService.getImagesForSgiId(id);
        return ResponseEntity.ok().body(imagesPayload);
    }

    @GetMapping("/get-images-fact-sgi")
    @ResponseBody
    public ResponseEntity<List<ImagesPayload>> getImagesForFactSgiId(@RequestParam UUID id) {
        List<ImagesPayload> imagesPayload = imageService.getImagesForFactSgiId(id);
        return ResponseEntity.ok().body(imagesPayload);
    }

    @GetMapping("/test")
    public Object testMethod() {
        return sgiService.getPage(0, 16);
    }

}
