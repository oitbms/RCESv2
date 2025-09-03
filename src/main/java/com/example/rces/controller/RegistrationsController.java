package com.example.rces.controller;

import com.example.rces.models.Employee;
import com.example.rces.models.Requests;
import com.example.rces.models.enums.MlmNode;
import com.example.rces.models.enums.Role;
import com.example.rces.service.EmployeeService;
import com.example.rces.service.RequestsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static com.example.rces.utils.ServiceUtil.*;

@Controller
public class RegistrationsController {

    private final EmployeeService employeeService;
    private final RequestsService requestsService;

    @Autowired
    public RegistrationsController(EmployeeService employeeService, RequestsService requestsService) {
        this.employeeService = employeeService;
        this.requestsService = requestsService;
    }

    @GetMapping("/admin")
    public String admin(@AuthenticationPrincipal Employee currentUser, Model model) {
        List<Role> roles = List.of(Role.values());
        List<MlmNode> mlmNodes = List.of(MlmNode.values());
        model.addAttribute("users", employeeService.findAll());
        model.addAttribute("user", currentUser);
        model.addAttribute("mlmNodes", mlmNodes);
        model.addAttribute("roles", roles);
        return "admin";
    }

    @GetMapping("/menu")
    public String menu(@AuthenticationPrincipal Employee currentUser, Model model) {
        List<Requests> allRequest = requestsService.findAll();
        List<Requests> requestsList;
        if (currentUser.getRole().equalsIgnoreCase(String.valueOf(Role.MASTER))) {
            requestsList = allRequest.stream().filter(r -> currentUser.equals(r.getCreatedBy())).toList();
        } else {
            requestsList = allRequest.stream().filter(r -> currentUser.equals(r.getEmployee())).toList();
        }
        Map<String, List<Requests>> createMasterRequest = getCreateRequestsMaster(requestsList);
        Map<String, List<Integer>> dailyCountsMap = getCountDays(allRequest);
        Map<String, Integer> qtyRequests = countRequest(allRequest);
        List<Requests> requestsFilterDate = filterRequestsByCurrentMonth(
                allRequest, LocalDate.now());
        List<Integer> dailyCountsList = countDailyRequestsList(requestsFilterDate);
        model.addAttribute("user", currentUser);
        model.addAttribute("requests", requestsList);
        model.addAttribute("requestsMaster", createMasterRequest);
        model.addAttribute("dailyCounts", dailyCountsList);
        model.addAttribute("dailyCountsConstructor", dailyCountsMap.get("constructor"));
        model.addAttribute("dailyCountOtk", dailyCountsMap.get("otk"));
        model.addAttribute("dailyCountTechnologist", dailyCountsMap.get("technologist"));
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
        employeeService.save(username, mlmNode, role, password, chatId);
        return "redirect:/admin";
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        employeeService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/update")
    public String updateUser(@RequestParam Long id,
                             @RequestParam(required = false) String userName,
                             @RequestParam(required = false) String mlmNodeName,
                             @RequestParam(required = false) String roleName,
                             @RequestParam(required = false) Long chatName,
                             @RequestParam(required = false) Boolean active) {
        employeeService.update(id, userName, mlmNodeName, roleName, chatName, active);
        return "redirect:/admin";
    }
}