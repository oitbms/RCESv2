package com.example.rces.controller;

import com.example.rces.models.SGI;
import com.example.rces.services.CustomUserDetailsService;
import com.example.rces.services.UniversalService;
import com.example.rces.services.telegram.MessageType;
import com.example.rces.services.telegram.TelegramService;
import jakarta.ws.rs.ForbiddenException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static com.example.rces.utils.ServiceUtil.colorCalculate;
import static com.example.rces.utils.ServiceUtil.createLog;

@Controller
@RequestMapping("/sgi")
public class SGController {

    private final UniversalService service;

    private final TelegramService tgService;

    private final CustomUserDetailsService userDetailsService;

    @Autowired
    public SGController(UniversalService service, TelegramService tgService, CustomUserDetailsService userDetailsService) {
        this.service = service;
        this.tgService = tgService;
        this.userDetailsService = userDetailsService;
    }

    @GetMapping
    public String getSGIForm(Model model) {
        return "sgiNew";
    }

    @PostMapping("/create")
    public String createSGI(
            @RequestParam String workcenter,
            @RequestParam String event,
            @RequestParam String actions,
            @RequestParam String department,
            @RequestParam String employee,
            @RequestParam LocalDate desiredDate,
            @RequestParam(required = false) String note,
            @RequestParam(required = false) MultipartFile[] additionalFiles,
            @RequestParam(required = false) String parentId) {
        if (!userDetailsService.isControl()) {
            throw new ForbiddenException("Создавать заявки могут только управление");
        }
        SGI sgi = service.createRequestSGI(workcenter, event, actions, department, desiredDate, note, employee, additionalFiles, parentId);
        tgService.sendMessage(sgi, null, MessageType.CREATE);
        return "redirect:/sgi";
    }

    @PostMapping("/save-change")
    public ResponseEntity<Void> saveChanges(@RequestParam UUID id,
                                            @RequestParam(required = false) String workcenter,
                                            @RequestParam(required = false) String event,
                                            @RequestParam(required = false) String actions,
                                            @RequestParam(required = false) String department,
                                            @RequestParam(required = false) LocalDate desiredDate,
                                            @RequestParam(required = false) String employee,
                                            @RequestParam(required = false) String note,
                                            @RequestParam(required = true) Boolean factExecutionSGIBool,
                                            @RequestParam(required = false) LocalDate executionDate,
                                            @RequestParam(required = false) String report,
                                            @RequestParam(required = false) MultipartFile[] imagesSGI,
                                            @RequestParam(required = false) MultipartFile[] imagesFactSGI
    ) throws CloneNotSupportedException {
        SGI sgi = service.findById(SGI.class, id);
        if (!factExecutionSGIBool) {
            if (!userDetailsService.isControl()) {
                throw new ForbiddenException("Редактировать может только создатель задачи");
            }
            SGI oldSgi = (SGI) sgi.clone();
            boolean planDateExist = !(sgi.getPlanDate() == null);
            service.saveSGI(sgi, workcenter, event, actions, department, desiredDate, employee,
                    note, executionDate, false, executionDate, report, imagesSGI, imagesFactSGI);
            if (!planDateExist && executionDate != null) {
                tgService.sendMessage(sgi, null, MessageType.WORK);
            } else {
                tgService.sendMessage(sgi, null, MessageType.UPDATE);
            }
            createLog(oldSgi, sgi, userDetailsService.currentUser(), service);
        } else {
            if (!userDetailsService.isResponsible(sgi.getEmployee()) & !userDetailsService.isControl()) {
                throw new ForbiddenException("Создавать факт выполнения может только ответственный за мероприятие сотрудник");
            }
            service.saveSGI(sgi, workcenter, event, actions, department, desiredDate, employee,
                    note, executionDate, true, executionDate, report, imagesSGI, imagesFactSGI);
        }

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete")
    @ResponseBody
    public void deleteSGI(@RequestBody List<UUID> ids) {
        ids.forEach(id -> {
            service.delete(service.findById(SGI.class, id));
            tgService.sendMessage(service.findById(SGI.class, id), null, MessageType.DELETE);
        });
    }

    @PostMapping("/agree")
    public ResponseEntity<Void> coordination(@RequestParam UUID id, @RequestParam Boolean agreed) throws CloneNotSupportedException {
        SGI sgi = service.findById(SGI.class, id);
        SGI oldSgi = (SGI) sgi.clone();
        if (userDetailsService.isControl()) {
            if (sgi.getSubSGI().stream().allMatch(SGI::getAgreed)) {
                sgi.setAgreed(agreed);
                sgi.setColor(colorCalculate(sgi, LocalDate.now()));
                service.save(sgi);
                tgService.sendMessage(sgi, null, MessageType.CLOSE);
                createLog(oldSgi, sgi, userDetailsService.currentUser(), service);
                return ResponseEntity.ok().build();
            }
        }
        return ResponseEntity.badRequest().build();
    }

    @PostMapping("/calculate-color")
    public ResponseEntity<Void> reCalculateColor() {
        LocalDate today = LocalDate.now();
        List<SGI> sgiList = service.findAll(SGI.class);
        for (SGI sgi : sgiList) {
            sgi.setColor(colorCalculate(sgi, today));
            service.save(sgi);
        }
        return ResponseEntity.ok().build();
    }

}
