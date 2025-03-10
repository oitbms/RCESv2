//контроллер формы создания заявки на вызов технолога
package com.example.rces.controller;

import com.example.rces.controller.payload.TechnologistPayload;
import com.example.rces.models.Technologist;
import com.example.rces.services.TechnologistServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/technologistbid")
public class TechnologistBidController {

    @Autowired
    private TechnologistServices service;

    @PostMapping("/create")
    public String createRequestFromTechnologist(TechnologistPayload payload) {
        Technologist technologist = service.createTechnologist(payload);
        return "redirect:/technologistmain/request/%s".formatted(technologist.getId());
    }

}
