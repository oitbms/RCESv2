//Контроллер главного меню
package com.example.rces.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/home")
public class Home {

    @GetMapping
    public String home(Model model) {
        return "home";
    }

}
