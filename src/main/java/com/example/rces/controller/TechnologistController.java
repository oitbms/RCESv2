//контроллер формы просмотра списка заявок технологов
package com.example.rces.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/technologistmain")
public class TechnologistController {

    @GetMapping
    public String home(Model model) {
        return "technologistmain";
    }

}
