//контроллер формы создания заявки на вызов технолога
package com.example.rces.controller;

import com.example.rces.models.*;
import com.example.rces.services.TelegramService;
import com.example.rces.services.UniversalService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Controller
@RequiredArgsConstructor
@RequestMapping("/technologistbid")
public class TechnologistBidController {

    @Autowired
    private UniversalService service;

    @Autowired
    private TelegramService tgService;

    @Autowired
    private  ObjectMapper objectMapper;

    @GetMapping("/create")
    public String getCreateBidForm(Model model) {
        model.addAttribute("createForm", true);
        return "technologistbid";
    }

    //Создание, сохранение заявки и отправка сообщения в ТГ
    @PostMapping("/create")
    public String createRequestFromTechnologist(@RequestParam("employeeJson") String employeeJson,
                                                @RequestParam("customerOrderJson") String customerOrderJson,
                                                @RequestParam(value = "reasonsJson") String reasonsJson,
                                                @RequestParam(value = "comment", required = false) String comment,
                                                @RequestParam(value = "additionalFiles", required = false) MultipartFile[] additionalFiles,
                                                Model model) throws JsonProcessingException {
        model.addAttribute("create", true);

        Employee employee = objectMapper.readValue(employeeJson, Employee.class);
        CustomerOrder customerOrder = objectMapper.readValue(customerOrderJson, CustomerOrder.class);
        GeneralReason.Technologist reason = objectMapper.readValue(reasonsJson, GeneralReason.Technologist.class);

        Technologist technologist = service.createRequestEntity(Technologist.class, employee, customerOrder, reason, comment, additionalFiles);

        tgService.sendMessageToGroup(technologist.getRequestNumber(), technologist.getEmployee().getName(), technologist.getCustomerOrder().getName(), !technologist.getImage().isEmpty(),technologist.getReason().getName(), technologist.getComment());
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

//    @PostMapping("/view/{requestNumber}")
//    public String updateViewBidForm(@ModelAttribute Technologist technologist,
//                                    @ModelAttribute Status status,
//                                    Model model) {
//        technologist.setStatus(status);
//        service.save(technologist);
//        model.addAttribute("create", false);
//        return "success";
//    }


}
