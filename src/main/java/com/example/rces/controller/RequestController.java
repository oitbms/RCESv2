package com.example.rces.controller;

import com.example.rces.models.CustomerOrder;
import com.example.rces.models.Employee;
import com.example.rces.models.Requests;
import com.example.rces.models.enums.GeneralReason;
import com.example.rces.models.enums.Item;
import com.example.rces.models.enums.MlmNode;
import com.example.rces.models.enums.Status;
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

import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

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
        if (!Arrays.stream(Requests.Type.values()).map(Enum::name).toList().contains(type)) {
            model.addAttribute("type", type);
            return "error";
        }
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = userDetailsService.loadUserByUsername(authentication.getName());
        model.addAttribute("createForm", true);
        model.addAttribute("type", type);
        model.addAttribute(type, true);
        model.addAttribute("employeeName", userDetails.getUsername());
        return "/requests";
    }

    @PostMapping("/create")
    public String createRequest(@RequestParam String type,
                                @RequestParam String employeeJson,
                                @RequestParam String mlmNodeJson,
                                @RequestParam(value = "itemNameJson") String itemJson,
                                @RequestParam(required = false) Integer qty,
                                @RequestParam(required = false) String customerOrderString,
                                @RequestParam(required = false) String customerOrderJson,
                                @RequestParam(required = false) String reasonsJson,
                                @RequestParam(required = false) String comment,
                                @RequestParam(required = false) MultipartFile[] additionalFiles,
                                Model model) throws JsonProcessingException {
        model.addAttribute("create", true);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Employee createdEmployee = userDetailsService.loadUserByUsername(authentication.getName());

        Employee employee = objectMapper.readValue(employeeJson, Employee.class);
        CustomerOrder customerOrder = service.createOrGetCustomerOrder(objectMapper, employee, customerOrderString, customerOrderJson);

        GeneralReason reason = null;
        if (!reasonsJson.isBlank()) {
            reason = objectMapper.readValue(reasonsJson, GeneralReason.class);
        }
        Item item = null;
        if (itemJson != null) {
            item = objectMapper.readValue(itemJson, Item.class);
        }
        MlmNode mlmNode = null;
        if (!mlmNodeJson.isBlank()) {
            mlmNode = objectMapper.readValue(mlmNodeJson, MlmNode.class);
        }

        Requests request = service.createRequest(type, employee, mlmNode, item, qty, customerOrder, reason, comment, additionalFiles, createdEmployee);

        if (request.getTypeRequest().equals(Requests.Type.constructor)) {
            tgService.sendMessageToGroup(request);
        } else {
            tgService.sendMessageToUser(request, employee.getChatId(), true, false);
        }

        model.addAttribute("requestNumber", request.getRequestNumber());

        return "success";
    }

    @GetMapping("/view/{requestNumber}")
    public String getViewBidForm(@PathVariable("requestNumber") Integer requestNumber, Model model) {
        Requests requests = service.findSingleByField(Requests.class, "requestNumber", requestNumber);
        model.addAttribute("bid", requests);
        model.addAttribute("type", requests.getTypeRequest());
        model.addAttribute("date", formatedDate(requests.getCreateDate()));
        model.addAttribute("viewForm", true);
        return "/requests";
    }

    @GetMapping("/requestslist/{type}/{pageNumber}")
    public String getRequestList(@PathVariable String type, @PathVariable int pageNumber,
                                 @RequestParam(value = "status", required = false) String status,
                                 @RequestParam(value = "customerOrder", required = false) String customerOrder,
                                 Model model) {
        List<CustomerOrder> cust = service.findAll(CustomerOrder.class);
        boolean currentPage = pageNumber > 0;
        boolean isStatus = true;
        int itemsPerPage = 20;
        int totalRequestsCount;
        List<Requests> requests;
        if (status == null || status.isEmpty()) {
            requests = service.findAllByField(Requests.class, "typeRequest", type)
                    .stream().sorted(Comparator.comparing(Requests::getRequestNumber))
                    .skip((long) pageNumber * itemsPerPage)
                    .limit(itemsPerPage)
                    .collect(Collectors.toList());
            totalRequestsCount = service.findAllByField(Requests.class, "typeRequest", type).size();
        } else {
            switch (status.trim()) {
                case "Новый" -> status = "New";
                case "В работе" -> status = "InWork";
                case "Закрыт" -> status = "Closed";
                case "Отменен" -> status = "Cancel";
            }
            String finalStatus = status;
            requests = service.findAllByField(Requests.class, "typeRequest", type)
                    .stream()
                    .filter(r -> r.getStatus().equals(Status.valueOf(finalStatus)))
                    .sorted(Comparator.comparing(Requests::getRequestNumber))
                    .toList();
            totalRequestsCount = service.findAllByField(Requests.class, "typeRequest", type)
                    .stream()
                    .filter(r -> r.getStatus().equals(Status.valueOf(finalStatus)))
                    .toList().size();
            isStatus = false;
        }
        if (customerOrder != null && !customerOrder.isEmpty()) {
            requests = requests.stream()
                    .filter(req -> req.getCustomerOrder().getName().equals(customerOrder))
                        .skip((long) pageNumber * itemsPerPage)
                    .limit(itemsPerPage)
                    .toList();
        }
        boolean hasNextPage = (requests.size() == itemsPerPage) && (totalRequestsCount > (pageNumber + 1) * itemsPerPage);
        List<Status> bidStatus = List.of(Status.values());
        List<String> formattedDates = requests.stream()
                .map(request -> formatedDate(request.getCreateDate()))
                .collect(Collectors.toList());
        List<String> updateDate = requests.stream()
                        .map(req -> formatedDate(req.getUpdateDate())).toList();
        model.addAttribute("bidList", requests);
        model.addAttribute("formattedBidList", formattedDates);
        model.addAttribute("updateDateList", updateDate);
        model.addAttribute("bidStatus", bidStatus);
        model.addAttribute("currentPage", pageNumber);
        model.addAttribute("booleanCurrentPage", currentPage);
        model.addAttribute("status", isStatus);
        model.addAttribute("type", type);
        model.addAttribute("selectedStatus", status);
        model.addAttribute("hasNextPage", hasNextPage);
        model.addAttribute("customerOrder",cust);
        return "requestslist";
    }
}
