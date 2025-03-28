package com.example.rces.controller;

import com.example.rces.models.Employee;
import com.example.rces.models.enums.MlmNode;
import com.example.rces.models.enums.Role;
import com.example.rces.repository.EmployeeRepository;
import com.example.rces.services.UniversalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;
import java.util.UUID;

@Controller
public class RegistrationsController {

    @Autowired
    private UniversalRepository universalRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @GetMapping("/admin")
    public String admin(Model model) {
        model.addAttribute("users", universalRepository.findAll(User.class));
        return "admin";
    }

    @GetMapping("/registration")
    public String registration(Model model) {
        model.addAttribute("userRole", Role.values());
        model.addAttribute("mlmNode", MlmNode.values());
        return "registration";
    }

    @PostMapping("/registration")
    public String addUser(@RequestParam String mlmNode, String role, Employee employee, Map<String, Object> model) {
        Employee userFromDb = universalRepository.findByName(Employee.class, employee.getName());

        if (userFromDb != null) {
            model.put("message", "User exist!");
            return "registration";
        }
        employee.setActive(true);
        employee.setRole(Collections.singleton(Role.valueOf(role)));
        universalRepository.save(employee);

        Employee employee = new Employee();
        employee.setName(user.getUsername());
        employee.setRole(role);
        employee.setMlmNode(MlmNode.valueOf(mlmNode));
        employee.setId(user.getId());
        employee.setActive(true);

        employeeRepository.save(employee);

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