//// Контроллер формы создания заявки на вызов конструктора
package com.example.rces.controller;

import com.example.rces.models.Constructor;
import com.example.rces.models.CustomerOrder;
import com.example.rces.models.Employee;
import com.example.rces.services.CustomUserDetailsService;
import com.example.rces.services.TelegramService;
import com.example.rces.services.UniversalService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Controller
@RequestMapping("/constructorbid")
public class ConstructorBidController {

    @Autowired
    private UniversalService service;

    @Autowired
    private TelegramService telegramService;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CustomUserDetailsService userDetailsService;


    @GetMapping("/create")
    public String getCreateBidForm(Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        model.addAttribute("createForm", true);
        model.addAttribute("employeeName", userDetails.getUsername());
        return "constructorbid";
    }

    @PostMapping("/create")
    public String createRequestFromTechnologist(
            @RequestParam("employeeJson") String employeeJson,
            @RequestParam("customerOrderJson") String customerOrderJson,
            @RequestParam(value = "comment", required = false) String comment,
            @RequestParam(value = "additionalFiles", required = false) MultipartFile[] additionalFiles,
            Model model) throws JsonProcessingException {

        model.addAttribute("create", true);

        CustomerOrder customerOrder = service.getOrCreateCustomerOrder(customerOrderJson);
        Employee employee = objectMapper.readValue(employeeJson, Employee.class);
        Constructor constructor = service.createRequestEntity(Constructor.class, employee, customerOrder, null, comment, additionalFiles);
        String reasonName = constructor.getReason() != null ? constructor.getReason().getName() : "Нет причины";
        telegramService.sendMessageToGroup(
                constructor.getRequestNumber(),
                constructor.getEmployee().getName(),
                constructor.getCustomerOrder().getName(),
                reasonName,
                constructor.getComment()
        );

        model.addAttribute("requestNumber", constructor.getRequestNumber());
        return "successconstructor";
    }

    @GetMapping("/view/{requestNumber}")
    public String getViewBidForm(@PathVariable("requestNumber") Integer requestNumber, Model model) {
        Constructor constructor = service.findByRequestNumber(Constructor.class, requestNumber);
        List<Employee> employees = service.getEmployeesByRole("Technologist");
        model.addAttribute("bid", constructor);
        model.addAttribute("employees", employees);
        model.addAttribute("viewForm", true);
        return "/constructorbid";
    }
}