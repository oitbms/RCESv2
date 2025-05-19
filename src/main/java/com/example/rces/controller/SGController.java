package com.example.rces.controller;

import com.example.rces.controller.payload.ExecutionsPayload;
import com.example.rces.models.Employee;
import com.example.rces.models.FactExecutionSGI;
import com.example.rces.models.Images;
import com.example.rces.models.SGI;
import com.example.rces.services.TelegramService;
import com.example.rces.services.UniversalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Controller
@RequestMapping("/sgi")
public class SGController {

    @Autowired
    private UniversalService service;

    @Autowired
    private TelegramService tgService;

    @GetMapping()
    public String getSGIForm(Model model, Principal principal) {
        List<SGI> sgiList = service.findAll(SGI.class);
        List<Employee> employees = service.findAll(Employee.class);
        Employee employee = service.findSingleByField(Employee.class, "name", principal.getName());
        model.addAttribute("sgiList", sgiList);
        model.addAttribute("employeesList", employees);

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
            @RequestParam LocalDateTime desiredDate,
            @RequestParam LocalDateTime planDate) {
        Employee employee = service.findSingleByField(Employee.class, "name", employees);
        service.createRequestSGI(workshop, event, actions, department, comment, desiredDate, planDate, employee);
        return "redirect:/sgi";
    }

    @GetMapping("/fact-executions")
    @ResponseBody
    public List<FactExecutionSGI> getFactExecutions(@RequestParam UUID sgiId) {
        return service.findAllByField(FactExecutionSGI.class,"sgi_id",sgiId);
    }

    @PostMapping("/create/execution")
    public void createSGIExecution(@RequestParam UUID id,
                                   @RequestParam LocalDateTime executionDate,
                                   @RequestParam String report,
                                   @RequestParam(required = false) MultipartFile[] photos) {
        service.createFactExecutionSGI(id, new ExecutionsPayload(executionDate, report), photos);
    }

    @DeleteMapping("/delete")
    @ResponseBody
    public void deleteSGI(@RequestParam("id") UUID id) {
        service.delete(service.findById(SGI.class, id));
    }

}
