package com.example.rces.controller.mvc;

import com.example.rces.configuration.DeviceDetector;
import com.example.rces.dto.CreateRequestDto;
import com.example.rces.dto.RequestDto;
import com.example.rces.dto.SubDivisionDTO;
import com.example.rces.mapper.SubDivisionMapper;
import com.example.rces.models.Employee;
import com.example.rces.models.Requests;
import com.example.rces.service.EmployeeService;
import com.example.rces.service.RequestsService;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static com.example.rces.service.impl.CustomUserDetailsServiceImpl.currentUser;
import static com.example.rces.utils.DateUtil.formatedDate;


@Controller
public class RequestController {

    private final EmployeeService employeeService;
    private final DeviceDetector detector;
    private final RequestsService requestsService;
    private final SubDivisionMapper subDivisionMapper;

    @Autowired
    public RequestController(EmployeeService employeeService, DeviceDetector detector, RequestsService requestsService, SubDivisionMapper subDivisionMapper) {
        this.employeeService = employeeService;
        this.detector = detector;
        this.requestsService = requestsService;
        this.subDivisionMapper = subDivisionMapper;
    }

    @GetMapping("/create")
    public String getCreateBidForm(@RequestParam String type, Model model) {
        if (!Arrays.stream(Requests.Type.values()).map(Enum::name).toList().contains(type)) {
            model.addAttribute("type", type);
            return "error";
        }
        Employee currentUser = currentUser().orElseThrow();
        SubDivisionDTO subDivisionDTO = subDivisionMapper.toDTO(currentUser.getSubDivision());
        model.addAttribute("createForm", true);
        model.addAttribute("type", type);
        model.addAttribute(type, true);
        model.addAttribute("employeeName", currentUser.getName());
        model.addAttribute("mlmNodeEmployee", subDivisionDTO);
        return "/requests";
    }

    @PostMapping("/create")
    public String createRequest(@ModelAttribute CreateRequestDto createRequestDto, Model model) throws JsonProcessingException {
        Employee createdEmployee = currentUser().orElseThrow();
        RequestDto requestDto = requestsService.createRequest(createdEmployee, createRequestDto);
        model.addAttribute("create", true);
        model.addAttribute("requestNumber", requestDto.getRequestNumber());
        return "success";
    }

    @GetMapping("/view/{requestNumber}")
    public String getViewBidForm(@PathVariable("requestNumber") Integer requestNumber, Model model) {
        Requests requests = requestsService.findByRequestNumber(requestNumber);
        Employee user = currentUser().orElseThrow();
        model.addAttribute("bid", requests);
        model.addAttribute("type", requests.getTypeRequest());
        model.addAttribute("date", formatedDate(requests.getCreatedDate()));
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
                .map(request -> formatedDate(request.getCreatedDate()))
                .collect(Collectors.toList());
        List<String> updateDate = requestsList.stream()
                .map(req -> formatedDate(req.getUpdatedDate())).toList();
        model.addAttribute("requestsList", requestsList);
        model.addAttribute("typeRequest", type);
        model.addAttribute("formattedBidList", formattedDates);
        model.addAttribute("updateDateList", updateDate);
        return "requestslist";
    }

}