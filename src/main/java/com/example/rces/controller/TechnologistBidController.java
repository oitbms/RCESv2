//контроллер формы создания заявки на вызов технолога
package com.example.rces.controller;

import com.example.rces.controller.payload.TechnologistPayload;
import com.example.rces.models.Technologist;
import com.example.rces.services.TechnologistServices;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequiredArgsConstructor
@RequestMapping("/technologistbid")
public class TechnologistBidController {

    @Autowired
    private TechnologistServices service;

    @GetMapping
    public String getRequestFromTechnologist(Model model) {
        return "technologistbid";
    }

    @PostMapping
    public String createRequestFromTechnologist(TechnologistPayload payload) {
        Technologist technologist = service.createTechnologist(payload);
        return "redirect:/technologistmain/request/%s".formatted(technologist.getId());
    }

}
