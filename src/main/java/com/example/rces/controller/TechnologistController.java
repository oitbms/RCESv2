//контроллер формы просмотра списка заявок технологов
package com.example.rces.controller;

import com.example.rces.models.Technologist;
import com.example.rces.models.base.EntityBase;
import com.example.rces.models.enums.Status;
import com.example.rces.services.UniversalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Comparator;
import java.util.List;
import java.util.Set;

@Controller
@RequestMapping("/technologistmain")
public class TechnologistController {

    @Autowired
    private UniversalService service;

    @GetMapping
    public String main(
            @RequestParam(required = false) Set<Status> statuses,
            Model model
    ) {
        List<Technologist> technologistList = service.findAll(Technologist.class);
        List<Technologist> filteredList = technologistList.stream()
                .filter(technologist -> statuses == null || statuses.contains(technologist.getStatus()))
                .sorted(Comparator.comparing(EntityBase::getRequestNumber))
                .toList();
        model.addAttribute("technologistList", filteredList);
        model.addAttribute("statuses", Status.values());

        return "technologistmain";
    }

}
