//контроллер формы просмотра списка заявок отк
package com.example.rces.controller;

import com.example.rces.services.OtkService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
//@RequestMapping("/otkmain")
public class OtkController {

    private final OtkService otkService;

    public OtkController(OtkService otkService) {
        this.otkService = otkService;
    }

//    @GetMapping("/")
//    public String OtkBids(Model model) {
//        model.addAttribute("OtkBids", otkService.listBids());
//        return "otkbids";
//    }

}
