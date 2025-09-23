package com.example.rces.controller;

import com.example.rces.models.ApplicationInfo;
import com.example.rces.service.HelpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/help")
public class HelpController {

    @Autowired
    private HelpService helpService;

    @GetMapping
    public String showHelpPage(Model model) {
        ApplicationInfo appInfo = helpService.getApplicationInfo();
        model.addAttribute("appInfo", appInfo);
        return "application-info";
    }

    @GetMapping("/api/json")
    @ResponseBody
    public ApplicationInfo getApplicationInfoJson() {
        return helpService.getApplicationInfo();
    }
}
