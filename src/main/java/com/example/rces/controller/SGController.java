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
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

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
        List<Employee> employeeList = service.findAll(Employee.class);
        model.addAttribute("emploeesList",employeeList);
        model.addAttribute("sgiList", sgiList);
        return "sgi";
    }

    @PostMapping("/createSGI")
    public String createSGI(@RequestParam("workshop") String workshop,
                            @RequestParam("event")  String event,
                            @RequestParam("actions") String actions,
                            @RequestParam("department") String department,
                            @RequestParam("emploees") Long emploees,
                            @RequestParam("comment") String comment,
                            @RequestParam("desiredDate") LocalDateTime desiredDate,
                            @RequestParam("planDate") LocalDateTime planDate) {
        Employee employe = service.findById(Employee.class, emploees);
        SGI requestSGI = service.createRequestSGI(workshop, event, actions, department, comment, desiredDate, planDate,employe);
        return "redirect:/sgi";
    }


}
