//Контроллер формы создания заявки на вызов отк
package com.example.rces.controller;

import com.example.rces.models.OtkBid;
import com.example.rces.services.OtkBidService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
//@RequestMapping("/otkbids")
public class OtkBidController {
    private final OtkBidService OtkBidService;

    public OtkBidController(OtkBidService OtkBidService) {
        this.OtkBidService = OtkBidService;
    }

    @GetMapping("/")
    public String otkbids(Model model) {
        model.addAttribute("OtkBids", OtkBidService.listOtkBids());
        return "otkbids";
    }

    @PostMapping("/newotkbid")
    public String createOtkBid(OtkBid OtkBid) {
        OtkBidService.SaveOtkBid(OtkBid);
        return "redirect:/";
    }
}
