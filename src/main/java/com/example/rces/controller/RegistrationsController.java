package com.example.rces.controller;

import com.example.rces.models.Employee;
import com.example.rces.models.enums.MlmNode;
import com.example.rces.models.enums.Role;
import com.example.rces.models.User;
import com.example.rces.repository.EmployeeRepository;
import com.example.rces.repository.UserRepository;
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
    private UserRepository userRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @GetMapping("/admin")
    public String admin(Model model) {
        model.addAttribute("users", userRepository.findAll());
        return "admin";
    }

    @GetMapping("/registration")
    public String registration(Model model) {
        model.addAttribute("userRole", Role.values());
        model.addAttribute("mlmNode", MlmNode.values());
        return "registration";
    }

    @PostMapping("/registration")
    public String addUser(@RequestParam String mlmNode, String role, User user, Map<String, Object> model) {
        User userFromDb = userRepository.findByUsername(user.getUsername());

        if (userFromDb != null) {
            model.put("message", "User exist!");
            return "registration";
        }
        user.setEnabled(true);
        user.setRoles(Collections.singleton(Role.valueOf(role)));
        userRepository.save(user);

        Employee employee = new Employee();
        employee.setName(user.getUsername());
        employee.setRole(role);
        employee.setMlmNode(MlmNode.valueOf(mlmNode));
        employee.setUserId(user.getId());
        employee.setActive(true);
        employeeRepository.save(employee);
        return "redirect:/admin";
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable UUID id) {
        return userRepository.findById(id)
                .map(user -> {
                    userRepository.delete(user);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}

//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        String contextUser = authentication.getName();
