//контроллер формы создания заявки на вызов технолога
package com.example.rces.controller;

import com.example.rces.models.CustomerOrder;
import com.example.rces.models.Employee;
import com.example.rces.models.GeneralReason;
import com.example.rces.models.Technologist;
import com.example.rces.models.enums.Status;
import com.example.rces.services.TelegramService;
import com.example.rces.services.UniversalService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Arrays;
import java.util.UUID;

@Controller
@RequiredArgsConstructor
@RequestMapping("/technologistbid")
public class TechnologistBidController {

    @Autowired
    private UniversalService service;

    @Autowired
    private TelegramService tgService;

    @GetMapping
    public String getRequestFromTechnologist() {
        return "technologistbid";
    }

    //Создание, сохранение заявки и отправка сообщения в ТГ
    @PostMapping("/create")
    public String createRequestFromTechnologist(@RequestParam("employeeId") Long employeeId,
                                                @RequestParam("customerOrderId") UUID customerOrderId,
                                                @RequestParam("reasonsId") Long reasonsId,
                                                Model model) {
        Employee employee = service.findById(Employee.class, employeeId);
        CustomerOrder customerOrder = service.findById(CustomerOrder.class, customerOrderId);

        Technologist technologist = new Technologist();
        technologist.setEmployee(employee);
        technologist.setCustomerOrder(customerOrder);
        Arrays.stream(GeneralReason.Technologist.values())
                .filter(tech -> tech.getId().equals(reasonsId))
                .findFirst()
                .ifPresent(technologist::setReason);
        technologist.setStatus(Status.NEW);

        service.save(technologist);

        model.addAttribute("requestNumber", technologist.getRequestNumber());
        // Отправляем сообщение
        String message = String.format("Создана новая заявка: %d\nОтветственный: %s\nЗаказ клиента: %s\nПричина: %s",
                technologist.getRequestNumber(), employee.getName(), customerOrder.getName(), technologist.getReason().getName());
        tgService.sendMessage(message);

        return "success";
    }

}
