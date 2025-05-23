package com.example.rces.controller;

import com.example.rces.models.Employee;
import com.example.rces.models.Requests;
import com.example.rces.models.enums.MlmNode;
import com.example.rces.models.enums.Role;
import com.example.rces.services.UniversalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static com.example.rces.services.ServiceUtil.*;

@Controller
public class RegistrationsController {

    @Autowired
    private UniversalService service;

    @GetMapping("/admin")
    public String admin(Model model) {
        model.addAttribute("users", service.findAll(Employee.class));
        return "admin";
    }

    @GetMapping("/menu")
    public String menu(Principal principal, Model model) {
        List<Requests> requestsOfDate = service.findAll(Requests.class);
        Employee user = service.findSingleByField(Employee.class, "name", principal.getName());
        List<Requests> requestsList = service.findAllByField(Requests.class, "updateBy", user);
        Map<String, List<Integer>> dailyCountsMap = getCountDays(service.findAll(Requests.class));
        Map<String, Integer> qtyRequests = countRequest(requestsOfDate);
//        Map<String, Double> averageTime = averageTimeRequests(requestsList);
        List<Requests> requestsFilterDate = filterRequestsByCurrentMonth(
                service.findAll(Requests.class), LocalDate.now());
        List<Integer> dailyCountsList = countDailyRequestsList(requestsFilterDate);
        model.addAttribute("user", user);
        model.addAttribute("requests", requestsList);
        model.addAttribute("dailyCounts", dailyCountsList);
        model.addAttribute("dailyCountsConstructor", dailyCountsMap.get("constructor"));
        model.addAttribute("dailyCountOtk", dailyCountsMap.get("otk"));
        model.addAttribute("dailyCountTechnologist", dailyCountsMap.get("technologist"));
//        model.addAttribute("time", averageTime.get("constructor"));
//        model.addAttribute("timeOtk", averageTime.get("otk"));
//        model.addAttribute("timeTechnologist", averageTime.get("technologist"));
        model.addAttribute("qtuRequests", qtyRequests.get("constructor"));
        model.addAttribute("qtuRequestsOtk", qtyRequests.get("otk"));
        model.addAttribute("qtuRequestTechnologist", qtyRequests.get("technologist"));
        return "menu";
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
                          @RequestParam Long chatId) {
        Employee employee = service.saveEmployee(username,true,role,mlmNode,password,chatId);
        return "redirect:/admin";
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable UUID id) {
        Employee user = service.findById(Employee.class, id);
        if (user != null) {
            service.delete(user);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/update/{id}")
    public ResponseEntity<?> updateUser(@PathVariable UUID id,
                                        @RequestParam(required = false) String username,
                                        @RequestParam(required = false) Boolean state) {
        Employee user = service.findById(Employee.class, id);
        if (user != null) {
            user.setName(username);
            user.setActive(state);
            service.save(user);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}