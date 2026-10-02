package com.example.rces.controller.mvc;

import com.example.rces.configuration.WebSecurityConfig;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/machines")
public class MachineController {

    @ModelAttribute("canEdit")
    public boolean canEdit(Authentication authentication) {
        return WebSecurityConfig.isMachineEditor(authentication);
    }

    @GetMapping
    public String showMachineList(Model model) {
        model.addAttribute("activeTab", "machines");
        return "machines";
    }

    @GetMapping("/new")
    public String showCreateMachineForm() {
        return "machine-form";
    }

    @GetMapping("/{id}")
    public String showMachineDetails(@PathVariable("id") String id, Model model) {
        model.addAttribute("machineId", id);
        return "machine-details";
    }

    @GetMapping("/{id}/edit")
    public String showEditMachineForm(@PathVariable("id") String id, Model model) {
        model.addAttribute("machineId", id);
        return "machine-form";
    }
}
