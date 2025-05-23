package com.example.rces.controller;

import com.example.rces.controller.payload.ExecutionsPayload;
import com.example.rces.models.Employee;
import com.example.rces.models.FactExecutionSGI;
import com.example.rces.models.SGI;
import com.example.rces.services.CustomUserDetailsService;
import com.example.rces.services.UniversalService;
import jakarta.persistence.NoResultException;
import jakarta.ws.rs.ForbiddenException;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    private UniversalService service;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @GetMapping
    public String getSGIForm(Model model, Principal principal) {
        Employee employee = service.findSingleByField(Employee.class,"name", principal.getName());
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
        service.createRequestSGI(workshopModal, eventModal, actionsModal, departmentModal, noteModal, desiredDateModal, employee);
        return "redirect:/sgi";
    }

    @PostMapping("/save-change")
    public ResponseEntity<Void> saveChanges(@RequestParam UUID id,
                                            @RequestParam(required = false) String employee,
                                            @RequestParam(required = false) LocalDate planDate,
                                            @RequestParam(required = false) String comment) {
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
        sgi.setPlanDate(planDate);
        sgi.setColor(colorCalculate(sgi, LocalDate.now()));
        sgi.setComment(comment);
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
        sgi.setAgreed(agreed);
        sgi.setColor(colorCalculate(sgi, LocalDate.now()));
        service.save(sgi);
        return ResponseEntity.ok().build();
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
