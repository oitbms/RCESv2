package com.example.rces.controller;

import com.example.rces.configuration.DeviceDetector;
import com.example.rces.models.Employee;
import com.example.rces.models.Requests;
import com.example.rces.models.enums.MlmNode;
import com.example.rces.service.EmployeeService;
import com.example.rces.service.RequestsService;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static com.example.rces.utils.DateUtil.formatedDate;

@Controller
public class RequestController {

    private final EmployeeService employeeService;
    private final DeviceDetector detector;
    private final RequestsService requestsService;

    @Autowired
    public RequestController(EmployeeService employeeService, DeviceDetector detector, RequestsService requestsService) {
        this.employeeService = employeeService;
        this.detector = detector;
        this.requestsService = requestsService;
    }

    @GetMapping("/create")
    public String getCreateBidForm(@RequestParam String type, Model model) {
        if (!Arrays.stream(Requests.Type.values()).map(Enum::name).toList().contains(type)) {
            model.addAttribute("type", type);
            return "error";
        }
        Employee currentUser = employeeService.getCurrentUser();
        MlmNode node = currentUser.getMlmNode();
        model.addAttribute("createForm", true);
        model.addAttribute("type", type);
        model.addAttribute(type, true);
        model.addAttribute("employeeName", currentUser.getName());
        model.addAttribute("mlmNodeEmployee", node);
        return "/requests";
    }

    @PostMapping("/create")
    public String createRequest(@RequestParam String type,
                                @RequestParam String employeeJson,
                                @RequestParam String mlmNodeJson,
                                @RequestParam String titleJson,
                                @RequestParam(value = "itemNameJson") String itemJson,
                                @RequestParam(required = false) Integer qty,
                                @RequestParam(required = false) String control,
                                @RequestParam(required = false) String customerOrderString,
                                @RequestParam(required = false) String customerOrderJson,
                                @RequestParam(required = false) String reasonsJson,
                                @RequestParam(required = false) String comment,
                                @RequestParam(required = false) MultipartFile[] additionalFiles,
                                Model model) throws JsonProcessingException {
        model.addAttribute("create", true);
        Employee createdEmployee = employeeService.getCurrentUser();
        Requests request = requestsService.createRequest(createdEmployee, employeeJson, type, mlmNodeJson, itemJson, reasonsJson, qty, control,
                customerOrderString, customerOrderJson, comment, additionalFiles, titleJson);
        model.addAttribute("requestNumber", request.getRequestNumber());
        return "success";
    }


    @GetMapping("/view/{requestNumber}")
    public String getViewBidForm(@PathVariable("requestNumber") Integer requestNumber, Model model) {
        Requests requests = requestsService.findByRequestNumber(requestNumber);
        Employee user = employeeService.getCurrentUser();
        model.addAttribute("bid", requests);
        model.addAttribute("type", requests.getTypeRequest());
        model.addAttribute("date", formatedDate(requests.getCreateDate()));
        model.addAttribute("viewForm", true);
        model.addAttribute("role", user.getRole());
        return "/requests";
    }

    @GetMapping("/requestslist/{type}")
    public String getRequestList(@PathVariable String type,
                                 HttpServletRequest httpRequest,
                                 Model model) {
        if (detector.isMobile(httpRequest)) {
            return "/mobiledevice";
        }
        List<Requests> requestsList = requestsService.findAllByTypeRequest(Requests.Type.valueOf(type));
        List<String> formattedDates = requestsList.stream()
                .map(request -> formatedDate(request.getCreateDate()))
                .collect(Collectors.toList());
        List<String> updateDate = requestsList.stream()
                .map(req -> formatedDate(req.getUpdateDate())).toList();
        model.addAttribute("requestsList", requestsList);
        model.addAttribute("typeRequest", type);
        model.addAttribute("formattedBidList", formattedDates);
        model.addAttribute("updateDateList", updateDate);
        return "requestslist";
    }

}