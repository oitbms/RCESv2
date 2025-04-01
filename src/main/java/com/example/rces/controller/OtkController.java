//контроллер формы просмотра списка заявок отк
package com.example.rces.controller;

import com.example.rces.models.Otk;
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
@RequestMapping("/otkmain")
public class OtkController {

    @Autowired
    private UniversalService service;

    @GetMapping
    public String main(
            @RequestParam(required = false) Set<Status> statuses,
            Model model
    ) {
        List<Otk> otkList = service.findAll(Otk.class);
        List<Otk> filteredList = otkList.stream()
                .filter(otk -> statuses == null || statuses.contains(otk.getStatus()))
                .sorted(Comparator.comparing(EntityBase::getRequestNumber))
                .toList();
        model.addAttribute("otkList", filteredList);
        model.addAttribute("statuses", Status.values());

        return "otkmain";
    }

}
