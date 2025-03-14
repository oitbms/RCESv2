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
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/create")
    public String getCreateBidForm(Model model) {
        model.addAttribute("createForm", true);
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
        technologist.setStatus(Status.New);
        service.save(technologist);
        String message = String.format("Создана новая заявка: %d\nОтветственный: %s\nЗаказ клиента: %s\nПричина: %s",
                technologist.getRequestNumber(), employee.getName(), customerOrder.getName(), technologist.getReason().getName());
        tgService.sendMessageToGroup(message);

        model.addAttribute("requestNumber", technologist.getRequestNumber());
        model.addAttribute("create", true);

        return "success";
    }

    @GetMapping("/view/{requestNumber}")
    public String getViewBidForm(@PathVariable("requestNumber") Integer requestNumber, Model model) {
        Technologist technologist = service.findByRequestNumber(Technologist.class, requestNumber);
        model.addAttribute("bid", technologist);
        model.addAttribute("viewForm", true);
        return "/technologistbid";
    }

    @PostMapping("/view/{requestNumber}")
    public String updateViewBidForm(@ModelAttribute Technologist technologist,
                                    @ModelAttribute Status status,
                                    Model model) {
        technologist.setStatus(status);
        service.save(technologist);
        model.addAttribute("create", false);
        return "success";
    }


}
