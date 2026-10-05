package com.example.rces.controller.mvc;

import com.example.rces.configuration.WebSecurityConfig;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller()
@RequestMapping("/sub-division")
public class BuildingController {

    @ModelAttribute("canEdit")
    public boolean canEdit(Authentication authentication) {
        return WebSecurityConfig.isMachineEditor(authentication);
    }

    @GetMapping
    public String showSubDivisionList(Model model) {
        model.addAttribute("activeTab", "buildings");
        return "machines";
    }

    @GetMapping("/new")
    public String showCreateSubDivisionForm() {
        return "sub-division-form";
    }

    @GetMapping("/{id}")
    public String showMachineDetails(@PathVariable("id") Long id, Model model) {
        model.addAttribute("subDivisionId", id);
        return "sub-division-details";
    }

    @GetMapping("/{id}/edit")
    public String showEditMachineForm(@PathVariable("id") Long id, Model model) {
        model.addAttribute("subDivisionId", id);
        return "sub-division-form";
    }

}
