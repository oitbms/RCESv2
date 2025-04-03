package com.example.rces.controller;

import com.example.rces.models.CustomerOrder;
import com.example.rces.models.Employee;
import com.example.rces.models.enums.GeneralReason;
import com.example.rces.models.Requests;
import com.example.rces.models.enums.MlmNode;
import com.example.rces.services.CustomUserDetailsService;
import com.example.rces.services.TelegramService;
import com.example.rces.services.UniversalService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import static com.example.rces.services.ServiceUtil.formatedDate;

@Controller
public class RequestController {

    @Autowired
    private UniversalService service;

    @Autowired
    private TelegramService tgService;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @GetMapping("/create")
    public String getCreateBidForm(@RequestParam String type, Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = userDetailsService.loadUserByUsername(authentication.getName());
        model.addAttribute("createForm", true);
        model.addAttribute("type", type);
        model.addAttribute(type, true);
        model.addAttribute("employeeName", userDetails.getUsername());
        return "/requests";
    }

    @PostMapping("/create")
    public String createRequest(@RequestParam(value = "type") String type,
                                @RequestParam(value = "employeeJson") String employeeJson,
                                @RequestParam(value = "mlmNodeJson") String mlmNodeJson,
                                @RequestParam(value = "customerOrderString", required = false) String customerOrderString,
                                @RequestParam(value = "customerOrderJson", required = false) String customerOrderJson,
                                @RequestParam(value = "reasonsJson", required = false) String reasonsJson,
                                @RequestParam(value = "comment", required = false) String comment,
                                @RequestParam(value = "additionalFiles", required = false) MultipartFile[] additionalFiles,
                                Model model) throws JsonProcessingException {
        model.addAttribute("create", true);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Employee createdEmployee = userDetailsService.loadUserByUsername(authentication.getName());

        Employee employee = objectMapper.readValue(employeeJson, Employee.class);
        CustomerOrder customerOrder = null;
        if (!customerOrderJson.isBlank()) {
            customerOrder =  objectMapper.readValue(customerOrderJson, CustomerOrder.class);
        }else {
            customerOrder = service.createCustomerOrder(createdEmployee, customerOrderString);
        }

        GeneralReason reason = objectMapper.readValue(reasonsJson, GeneralReason.class);
        MlmNode mlmNode = objectMapper.readValue(mlmNodeJson, MlmNode.class);

        Requests request = service.createRequest(type, employee, mlmNode, customerOrder, reason, comment, additionalFiles, createdEmployee);

        tgService.sendMessageToGroup(request, type);
        model.addAttribute("requestNumber", request.getRequestNumber());

        return "success";
    }

    @GetMapping("/view/{requestNumber}")
    public String getViewBidForm(@PathVariable("requestNumber") Integer requestNumber, Model model) {
        Requests requests = service.findByRequestNumber(Requests.class, requestNumber);
        model.addAttribute("bid", requests);
        model.addAttribute("type", requests.getTypeRequest());
        model.addAttribute("date", formatedDate(requests.getCreateDate()));
        model.addAttribute("viewForm", true);
        return "/requests";
    }

}
