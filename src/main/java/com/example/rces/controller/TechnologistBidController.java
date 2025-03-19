//контроллер формы создания заявки на вызов технолога
package com.example.rces.controller;

import com.example.rces.models.Technologist;
import com.example.rces.models.enums.Status;
import com.example.rces.services.TelegramService;
import com.example.rces.services.UniversalService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
                                                @RequestParam(value = "additionalFiles", required = false) MultipartFile[] additionalFiles,
                                                Model model) {
        model.addAttribute("create", true);

        Technologist technologist = service.createRequestEntity(Technologist.class, employeeId, customerOrderId, reasonsId, additionalFiles);

        tgService.sendMessageToGroup(technologist.getRequestNumber(), technologist.getEmployee().getName(), technologist.getCustomerOrder().getName(), technologist.getReason().getName());

        model.addAttribute("requestNumber", technologist.getRequestNumber());
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
