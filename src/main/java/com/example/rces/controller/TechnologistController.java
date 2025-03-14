//контроллер формы просмотра списка заявок технологов
package com.example.rces.controller;

import com.example.rces.models.Technologist;
import com.example.rces.models.base.EntityBase;
import com.example.rces.services.UniversalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Comparator;
import java.util.List;

@Controller
@RequestMapping("/technologistmain")
public class TechnologistController {

    @Autowired
    private UniversalService service;

    @GetMapping
    public String main(Model model) {
        List<Technologist> technologistList = service.findAll(Technologist.class);
        model.addAttribute("technologistList", technologistList.stream().sorted(Comparator.comparing(EntityBase::getRequestNumber)).toList());
        return "technologistmain";
    }




}
