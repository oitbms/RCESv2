package com.example.rces.controller;

import com.example.rces.controller.payload.ExecutionsPayload;
import com.example.rces.models.Employee;
import com.example.rces.models.FactExecutionSGI;
import com.example.rces.models.SGI;
import com.example.rces.services.UniversalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static com.example.rces.services.ServiceUtil.formatedDate;

@Controller
@RequestMapping("/sgi")
public class SGController {

    @Autowired
    private UniversalService service;

    @GetMapping()
    public String getSGIForm(Model model, Principal principal) {
        List<SGI> sgiList = service.findAll(SGI.class);
        List<Employee> employees = service.findAll(Employee.class);
        Employee employee = service.findSingleByField(Employee.class, "name", principal.getName());
        List<String> updateDesiredDate = sgiList.stream()
                .map(req -> formatedDate(req.getDesiredDate())).toList();
        List<String> updatePlanDate = sgiList.stream()
                .map(req -> formatedDate(req.getPlanDate())).toList();
        model.addAttribute("sgiList", sgiList);
        model.addAttribute("employeesList", employees);
        model.addAttribute("updateDesiredDate", updateDesiredDate);
        model.addAttribute("updatePlanDate", updatePlanDate);

        return "sgi";
    }

    @PostMapping("/create")
    public String createSGI(
            @RequestParam String workshop,
            @RequestParam String event,
            @RequestParam String actions,
            @RequestParam String department,
            @RequestParam String employees,
            @RequestParam(required = false) String comment,
            @RequestParam LocalDate desiredDate,
            @RequestParam LocalDate planDate) {
        Employee employee = service.findSingleByField(Employee.class, "name", employees);
        service.createRequestSGI(workshop, event, actions, department, comment, desiredDate, planDate, employee);
        return "redirect:/sgi";
    }

    @GetMapping("/fact-executions")
    @ResponseBody
    public List<FactExecutionSGI> getFactExecutions(@RequestParam UUID sgiId) {
        return service.findAllByField(FactExecutionSGI.class, "sgi_id", sgiId);
    }

    @PostMapping("/create/execution")
    public ResponseEntity<Void> createSGIExecution(
            @RequestParam UUID id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDate executionDate,
            @RequestParam String report,
            @RequestParam(required = false) MultipartFile[] images) {
        service.createFactExecutionSGI(id, new ExecutionsPayload(null, executionDate.toString(), report), images);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/add-photo")
    public ResponseEntity<Void> addPhoto(@RequestParam() UUID id, @RequestParam() MultipartFile[] additionalFiles) {
        service.addPhoto(id, additionalFiles);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete")
    @ResponseBody
    public void deleteSGI(@RequestParam("id") UUID id) {
        service.delete(service.findById(SGI.class, id));
    }

    @DeleteMapping("/delete-fact")
    public ResponseEntity<Void> deleteFactSGI(@RequestParam("id") UUID id) {
        service.delete(service.findById(FactExecutionSGI.class, id));
        return ResponseEntity.ok().build();
    }

    @PostMapping("/delete-photo")
    public void deletePhoto(@RequestParam("id") UUID id) {
        service.deletePhoto(id);
    }
}
