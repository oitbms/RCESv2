package com.example.rces.controller;

import com.example.rces.controller.payload.ExecutionsPayload;
import com.example.rces.models.Employee;
import com.example.rces.models.FactExecutionSGI;
import com.example.rces.models.SGI;
import com.example.rces.services.CustomUserDetailsService;
import com.example.rces.services.TelegramService;
import com.example.rces.services.UniversalService;
import jakarta.persistence.NoResultException;
import jakarta.ws.rs.ForbiddenException;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.example.rces.services.ServiceUtil.colorCalculate;
import static com.example.rces.services.ServiceUtil.formatedDate;

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
    public String getSGIForm(Model model, Principal principal) {
        Employee employee = service.findSingleByField(Employee.class, "name", principal.getName());
        List<SGI> sgiList;
        if (!userDetailsService.isControl()) {
            sgiList = service.findAllByField(SGI.class, "employee",
                            userDetailsService.loadUserByUsername(principal.getName()))
                    .stream()
                    .sorted(Comparator.comparing(SGI::getRequestNumber))
                    .collect(Collectors.toList());
        } else {
            sgiList = service.findAll(SGI.class).stream()
                    .sorted(Comparator.comparing(SGI::getRequestNumber))
                    .collect(Collectors.toList());
        }
        List<String> updateDesiredDate = sgiList.stream()
                .map(req -> formatedDate(req.getDesiredDate())).toList();
        List<String> updatePlanDate = sgiList.stream()
                .map(req -> formatedDate(req.getPlanDate())).toList();
        model.addAttribute("user", employee);
        model.addAttribute("sgiList", sgiList);
        model.addAttribute("updateDesiredDate", updateDesiredDate);
        model.addAttribute("updatePlanDate", updatePlanDate);
        return "sgi";
    }

    @PostMapping("/create")
    public String createSGI(
            @RequestParam String workshopModal,
            @RequestParam String eventModal,
            @RequestParam String actionsModal,
            @RequestParam String departmentModal,
            @RequestParam String employeesModal,
            @RequestParam(required = false) String noteModal,
            @RequestParam LocalDate desiredDateModal) {
        if (!userDetailsService.isControl()) {
            throw new ForbiddenException("Создавать заявки могут только управление");
        }
        Employee employee = service.findSingleByField(Employee.class, "name", employeesModal);
        SGI sgi = service.createRequestSGI(workshopModal, eventModal, actionsModal, departmentModal, noteModal, desiredDateModal, employee);
        String message = String.format("Новое мероприятие №%s\nМероприятие: %s\nОтветственный: %s\nЖелаемый срок: %s\nСопутствующие действия: %s", sgi.getRequestNumber(), sgi.getEvent(), sgi.getEmployee().getName(), formatedDate(sgi.getDesiredDate()), sgi.getActions());
        tgService.sendMessageToControl(message, sgi.getDepartment().getName());
        return "redirect:/sgi";
    }

    @PostMapping("/save-change")
    public ResponseEntity<Void> saveChanges(@RequestParam UUID id,
                                            @RequestParam(required = false) String workshop,
                                            @RequestParam(required = false) String event,
                                            @RequestParam(required = false) String actions,
                                            @RequestParam(required = false) String department,
                                            @RequestParam(required = false) LocalDate desiredDate,
                                            @RequestParam(required = false) String employee,
                                            @RequestParam(required = false) LocalDate planDate,
                                            @RequestParam(required = false) String note) {
        if (!userDetailsService.isControl()) {
            throw new ForbiddenException("Редактировать может только создатель задачи");
        }
        SGI sgi = service.findById(SGI.class, id);
        try {
            Employee newEmployee = userDetailsService.loadUserByUsername(employee);
            sgi.setEmployee(newEmployee);
        } catch (Exception e) {
            throw new NoResultException();
        }
        sgi.setWorkShop(workshop);
        sgi.setEvent(event);
        sgi.setActions(actions);
        sgi.setDepartment(SGI.Department.valueOf(department));
        sgi.setPlanDate(planDate);
        sgi.setDesiredDate(desiredDate);
        sgi.setNote(note);
        sgi.setColor(colorCalculate(sgi, LocalDate.now()));
        service.save(sgi);
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

    @PostMapping("/add-photo")
    public ResponseEntity<Void> addPhoto(@RequestParam UUID id, @RequestParam MultipartFile[] additionalFiles) {
        service.addPhoto(id, additionalFiles);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete")
    @ResponseBody
    public void deleteSGI(@RequestParam UUID id) {
        service.delete(service.findById(SGI.class, id));
    }

    @DeleteMapping("/delete-fact")
    public ResponseEntity<Void> deleteFactSGI(@RequestParam("id") UUID id) {
        FactExecutionSGI factExecutionSGI = service.findById(FactExecutionSGI.class, id);
        service.delete(factExecutionSGI);
        SGI sgi = factExecutionSGI.getSgi();
        if (sgi.getExecutions().isEmpty()) {
            sgi.setAgreed(false);
        }
        sgi.setColor(colorCalculate(sgi, LocalDate.now()));
        service.save(sgi);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/delete-photo")
    public void deletePhoto(@RequestParam UUID id) {
        service.deletePhoto(id);
    }

    @PostMapping("/agree")
    public ResponseEntity<Void> coordination(@RequestParam UUID id, @RequestParam Boolean agreed) {
        SGI sgi = service.findById(SGI.class, id);
        if (userDetailsService.isControl()) {
            sgi.setAgreed(agreed);
            sgi.setColor(colorCalculate(sgi, LocalDate.now()));
            service.save(sgi);
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
