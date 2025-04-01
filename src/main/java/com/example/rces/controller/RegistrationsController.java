package com.example.rces.controller;

import com.example.rces.models.Employee;
import com.example.rces.models.enums.MlmNode;
import com.example.rces.models.enums.Role;
import com.example.rces.services.UniversalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@Controller
public class RegistrationsController {

    @Autowired
    private UniversalRepository universalRepository;

    @GetMapping("/admin")
    public String admin(Model model) {
        model.addAttribute("users", universalRepository.findAll(Employee.class));
        return "admin";
    }

    @GetMapping("/registration")
    public String registration(Model model) {
        model.addAttribute("userRole", Role.values());
        model.addAttribute("mlmNode", MlmNode.values());
        return "registration";
    }

    @PostMapping("/registration")
    @Transactional
    public String addUser(@RequestParam String username, String mlmNode, Role role, Employee employee, Map<String, Object> model) {
        Employee userFromDb = universalRepository.findByName(Employee.class, employee.getName());

        if (userFromDb != null) {
            model.put("message", "User exist!");
            return "registration";
        }
        employee.setName(username);
        employee.setActive(true);
        employee.setRole(role.getName());
        employee.setMlmNode(MlmNode.valueOf(mlmNode));
        universalRepository.save(employee);

        return "redirect:/admin";
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable UUID id) {
        Employee user = universalRepository.findById(Employee.class, id);
        if (user != null) {
            universalRepository.delete(user);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}