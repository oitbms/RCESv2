package com.example.rces.controller;

import com.example.rces.configuration.CustomAuthenticationProvider;
import com.example.rces.models.Employee;
import com.example.rces.models.enums.MlmNode;
import com.example.rces.models.enums.Role;
import com.example.rces.services.UniversalRepository;
import com.example.rces.services.UniversalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Controller
public class RegistrationsController {

    @Autowired
    private UniversalRepository universalRepository;

    @Autowired
    private UniversalService universalService;

    @GetMapping("/admin")
    public String admin(Model model) {
//        List<Role> roles = List.of(Role.values());
        model.addAttribute("users", universalService.findAll(Employee.class));
//        model.addAttribute("roles", roles);
        return "admin";
    }

    @GetMapping("/menu")
    public String menu(Principal principal, Model model) {
        Employee user = universalRepository.findByName(Employee.class,principal.getName());
        model.addAttribute("user",user);
        return "menu";
    }

    @GetMapping("/logout")
    public String logout() {
        return "redirect:/login";
    }

    @GetMapping("/registration")
    public String registration(Model model) {
        model.addAttribute("userRole", Role.values());
        model.addAttribute("mlmNode", MlmNode.values());
        return "registration";
    }

    @PostMapping("/registration")
    @Transactional
    public String addUser(@RequestParam String username,
                          @RequestParam String mlmNode,
                          @RequestParam String role,
                          @RequestParam String password,
                          Map<String, Object> model) {
        Employee userFromDb = universalRepository.findByName(Employee.class, username);
        if (userFromDb != null) {
            model.put("message", "Пользователь уже существует!");
            return "registration";
        }
        Employee employee = new Employee();
        employee.setName(username);
        employee.setActive(true);

        employee.setRole(role);
        employee.setMlmNode(MlmNode.valueOf(mlmNode));

        employee.setPassword(password);

        universalService.save(employee);

        return "redirect:/admin";
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable UUID id) {
        Employee user = universalService.findById(Employee.class, id);
        if (user != null) {
            universalService.delete(user);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}