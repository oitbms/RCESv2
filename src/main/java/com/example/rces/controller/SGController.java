package com.example.rces.controller;

import com.example.rces.models.Employee;
import com.example.rces.models.SGI;
import com.example.rces.services.CustomUserDetailsService;
import com.example.rces.services.TelegramService;
import com.example.rces.services.UniversalService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

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

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @GetMapping()
    public String getSGIForm(Model model) {
        List<SGI> sgiList = service.findAll(SGI.class);
        List<Employee> employees = service.findAll(Employee.class);
        model.addAttribute("sgiList", sgiList);
        model.addAttribute("employeesList", employees);
        return "sgi";
    }

    @PostMapping("/create")
    public String createSGI(
            @RequestParam() String workshop,
            @RequestParam() String event,
            @RequestParam() String actions,
            @RequestParam() String department,
            @RequestParam() String employees,
            @RequestParam(required = false) String comment,
            @RequestParam() LocalDateTime desiredDate,
            @RequestParam() LocalDateTime planDate) {
        Employee employee = service.findSingleByField(Employee.class, "name", employees);
        service.createRequestSGI(workshop, event, actions, department, comment, desiredDate, planDate,employee);
        return "redirect:/sgi";
    }

    @PostMapping("/delete")
    public String deleteSGI(@RequestParam("id") UUID id) {
        service.delete(service.findById(SGI.class, id));
        return "redirect:/sgi";
    }


}
