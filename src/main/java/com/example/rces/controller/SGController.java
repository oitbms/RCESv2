package com.example.rces.controller;

import com.example.rces.controller.payload.ExecutionsPayload;
import com.example.rces.models.Employee;
import com.example.rces.models.FactExecutionSGI;
import com.example.rces.models.SGI;
import com.example.rces.services.CustomUserDetailsService;
import com.example.rces.services.UniversalService;
import com.example.rces.services.telegram.MessageType;
import com.example.rces.services.telegram.TelegramService;
import jakarta.persistence.NoResultException;
import jakarta.ws.rs.ForbiddenException;
import org.springframework.format.annotation.DateTimeFormat;
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
            @RequestParam String workshopModal,
            @RequestParam String eventModal,
            @RequestParam String actionsModal,
            @RequestParam String departmentModal,
            @RequestParam String employeesModal,
            @RequestParam(required = false) String noteModal,
            @RequestParam LocalDate desiredDateModal,
            @RequestParam(required = false) MultipartFile[] additionalFiles) {
        if (!userDetailsService.isControl()) {
            throw new ForbiddenException("Создавать заявки могут только управление");
        }
        Employee employee = service.findSingleByField(Employee.class, "name", employeesModal);
        SGI sgi = service.createRequestSGI(workshopModal, eventModal, actionsModal, departmentModal, noteModal, desiredDateModal, employee, additionalFiles);
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
                                            @RequestParam(required = false) LocalDate planDate,
                                            @RequestParam(required = false) String note) throws CloneNotSupportedException {
        if (!userDetailsService.isControl()) {
            throw new ForbiddenException("Редактировать может только создатель задачи");
        }
        SGI sgi = service.findById(SGI.class, id);
        SGI oldSgi = (SGI) sgi.clone();
        boolean planDateExist = !(sgi.getPlanDate() == null);
        try {
            Employee newEmployee = userDetailsService.loadUserByUsername(employee);
            sgi.setEmployee(newEmployee);
        } catch (Exception e) {
            throw new NoResultException();
        }
        sgi.setWorkShop(workcenter);
        sgi.setEvent(event);
        sgi.setActions(actions);
        sgi.setDepartment(SGI.Department.valueOf(department));
        sgi.setPlanDate(planDate);
        sgi.setDesiredDate(desiredDate);
        sgi.setNote(note);
        sgi.setColor(colorCalculate(sgi, LocalDate.now()));
        service.save(sgi);
        if (!planDateExist && planDate != null) {
            tgService.sendMessage(sgi, null, MessageType.WORK);
        } else {
            tgService.sendMessage(sgi, null, MessageType.UPDATE);
        }
        createLog(oldSgi, sgi, userDetailsService.currentUser(), service);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/create/execution")
    public ResponseEntity<Void> createSGIExecution(
            @RequestParam UUID id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDate executionDate,
            @RequestParam(required = false) String report,
            @RequestParam(required = false) MultipartFile[] images) {
        SGI sgi = service.findById(SGI.class, id);
        if (!userDetailsService.isResponsible(sgi.getEmployee()) & !userDetailsService.isControl()) {
            throw new ForbiddenException("Создавать факт выполнения может только ответственный за мероприятие сотрудник");
        }
        service.createFactExecutionSGI(sgi, new ExecutionsPayload(null, executionDate.toString(), report), images);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/add-photoEx")
    public ResponseEntity<Void> addPhotoEx(@RequestParam UUID id, @RequestParam MultipartFile[] additionalFiles) {
        service.addPhotoEx(id, additionalFiles);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/add-photo")
    public ResponseEntity<Void> addPhoto(@RequestParam UUID id, @RequestParam MultipartFile[] additionalFiles) {
        service.addPhoto(id, additionalFiles);
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

    @DeleteMapping("/delete-fact")
    public ResponseEntity<Void> deleteFactSGI(@RequestParam("id") UUID id) {
        service.deleteById(FactExecutionSGI.class, id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/delete-photo")
    public void deletePhoto(@RequestParam UUID id) {
        service.deletePhoto(id);
    }

    @PostMapping("/agree")
    public ResponseEntity<Void> coordination(@RequestParam UUID id, @RequestParam Boolean agreed) throws CloneNotSupportedException {
        SGI sgi = service.findById(SGI.class, id);
        SGI oldSgi = (SGI) sgi.clone();
        if (userDetailsService.isControl()) {
            sgi.setAgreed(agreed);
            sgi.setColor(colorCalculate(sgi, LocalDate.now()));
            service.save(sgi);
            tgService.sendMessage(sgi, null, MessageType.CLOSE);
            createLog(oldSgi, sgi, userDetailsService.currentUser(), service);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
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
