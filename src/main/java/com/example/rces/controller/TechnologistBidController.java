//контроллер формы создания заявки на вызов технолога
package com.example.rces.controller;

import com.example.rces.models.CustomerOrder;
import com.example.rces.models.Employee;
import com.example.rces.models.GeneralReason;
import com.example.rces.services.TechnologistServices;
import com.example.rces.services.TelegramService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequiredArgsConstructor
@RequestMapping("/technologistbid")
public class TechnologistBidController {

    @Autowired
    private TechnologistServices service;

    @Autowired
    private TelegramService tgService;

    @GetMapping
    public String getRequestFromTechnologist(Model model) {
        return "technologistbid";
    }

    @PostMapping("/create")
    public String createRequestFromTechnologist(@RequestParam("employee") Employee employee,
                                                @RequestParam("customerOrder") CustomerOrder customerOrder,
                                                @RequestParam("reason") GeneralReason.Technologist reason,
                                                Model model) {

        Integer requestNumber = service.createTechnologist(employee, customerOrder, reason);
        model.addAttribute("requestNumber", requestNumber);

        String message = String.format("Создана новая заявка: %d\nСотрудник: %s\nЗаказ клиента: %s\nПричина: %s",
                requestNumber, employee.getName(), customerOrder.getName(), reason.toString());
        tgService.sendMessage(message);

        return "success";
    }

}
