////Контроллер формы создания заявки на вызов отк
//package com.example.rces.controller;
//
//import com.example.rces.models.CustomerOrder;
//import com.example.rces.models.Employee;
//import com.example.rces.models.enums.GeneralReason;
//import com.example.rces.models.Otk;
//import com.example.rces.services.CustomUserDetailsService;
//import com.example.rces.services.TelegramService;
//import com.example.rces.services.UniversalService;
//import com.fasterxml.jackson.core.JsonProcessingException;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.stereotype.Controller;
//import org.springframework.ui.Model;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//
//import static com.example.rces.services.ServiceUtil.formatedDate;
//
//@Controller
//@RequestMapping("/otkbid")
//public class OtkBidController {
//
//    @Autowired
//    private UniversalService service;
//
//    @Autowired
//    private TelegramService tgService;
//
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    @Autowired
//    private CustomUserDetailsService userDetailsService;
//
//    @GetMapping("/create")
//    public String getCreateBidForm(Model model) {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        String username = authentication.getName();
//        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
//        model.addAttribute("createForm", true);
//        model.addAttribute("employeeName", userDetails.getUsername());
//        return "otkbid";
//    }
//
//    @PostMapping("/create")
//    public String createRequestFromOtk(@RequestParam("employeeJson") String employeeJson,
//                                       @RequestParam("customerOrderJson") String customerOrderJson,
//                                       @RequestParam("reasonsJson") String reasonsJson,
//                                       @RequestParam(value = "comment", required = false) String comment,
//                                       @RequestParam(value = "additionalFiles", required = false) MultipartFile[] additionalFiles,
//                                       Model model) throws JsonProcessingException {
//        model.addAttribute("create", true);
//
//        Employee employee = objectMapper.readValue(employeeJson, Employee.class);
//
//        CustomerOrder customerOrder = objectMapper.readValue(customerOrderJson, CustomerOrder.class);
//
//        GeneralReason.Otk reason = objectMapper.readValue(reasonsJson, GeneralReason.Otk.class);
//
//        Otk otk = service.createRequestEntity(Otk.class, employee, customerOrder, reason, null, comment, additionalFiles);
//
//        tgService.sendMessageToGroup(
//                otk.getRequestNumber(),
//                otk.getEmployee().getName(),
//                otk.getCustomerOrder().getName(),
//                !otk.getImage().isEmpty(),
//                otk.getReason().getName(),
//                otk.getComment(),
//                "otk");
//
//        model.addAttribute("requestNumber", otk.getRequestNumber());
//
//        return "success";
//    }
//
//    @GetMapping("/view/{requestNumber}")
//    public String getViewBidForm(@PathVariable("requestNumber") Integer requestNumber, Model model) {
//        Otk otk = service.findByRequestNumber(Otk.class, requestNumber);
//        model.addAttribute("bid", otk);
//        model.addAttribute("date", formatedDate(otk.getCreateDate()));
//        model.addAttribute("viewForm", true);
//        return "/otkbid";
//    }
//}
