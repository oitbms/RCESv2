package com.example.rces.controller;

import com.example.rces.models.CustomerOrder;
import com.example.rces.models.Employee;
import com.example.rces.models.Requests;
import com.example.rces.models.enums.GeneralReason;
import com.example.rces.models.enums.Item;
import com.example.rces.models.enums.MlmNode;
import com.example.rces.services.CustomUserDetailsService;
import com.example.rces.services.TelegramService;
import com.example.rces.services.UniversalService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
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
    public String getCreateBidForm(@RequestParam String type, Model model, Principal principal) {
        if (!Arrays.stream(Requests.Type.values()).map(Enum::name).toList().contains(type)) {
            model.addAttribute("type", type);
            return "error";
        }
        model.addAttribute("createForm", true);
        model.addAttribute("type", type);
        model.addAttribute(type, true);
        model.addAttribute("employeeName", principal.getName());
        return "/requests";
    }

    @PostMapping("/create")
    public String createRequest(@RequestParam String type,
                                @RequestParam String employeeJson,
                                @RequestParam String mlmNodeJson,
                                @RequestParam(value = "itemNameJson") String itemJson,
                                @RequestParam(required = false) Integer qty,
                                @RequestParam(required = false) String control,
                                @RequestParam(required = false) String customerOrderString,
                                @RequestParam(required = false) String customerOrderJson,
                                @RequestParam(required = false) String reasonsJson,
                                @RequestParam(required = false) String comment,
                                @RequestParam(required = false) MultipartFile[] additionalFiles,
                                Model model,
                                Principal principal) throws JsonProcessingException {
        model.addAttribute("create", true);
        Employee createdEmployee = userDetailsService.loadUserByUsername(principal.getName());

        Employee employee = objectMapper.readValue(employeeJson, Employee.class);
        CustomerOrder customerOrder = service.createOrGetCustomerOrder(objectMapper, employee, customerOrderString, customerOrderJson);

        GeneralReason reason = null;
        String reasonText = null;
        if (Objects.equals(type, "otk")) {
            reasonText = String.valueOf(reasonsJson);
        } else {
            if (!reasonsJson.isBlank()) {
                reason = objectMapper.readValue(reasonsJson, GeneralReason.class);
            }
        }

        Item item = null;
        if (itemJson != null) {
            item = objectMapper.readValue(itemJson, Item.class);
        }
        MlmNode mlmNode = null;
        if (!mlmNodeJson.isBlank()) {
            mlmNode = objectMapper.readValue(mlmNodeJson, MlmNode.class);
        }

        try {
            if (employee.getChatId() == null) {
                throw new RuntimeException("Ошибка: chatId сотрудника равен null. Невозможно создать запрос и отправить сообщение пользователю.");
            }

            Requests request = service.createRequest(type, employee, mlmNode, item, qty, customerOrder, reason, comment, additionalFiles, createdEmployee, reasonText, control);

//            if (request.getTypeRequest().equals(Requests.Type.constructor)) {
//                tgService.sendMessageToGroup(request);
//            } else {
//                tgService.sendMessageToUser(request, employee.getChatId(), true, false);
//            }
            tgService.sendMessageToGroup(request);

            model.addAttribute("requestNumber", request.getRequestNumber());

        } catch (HttpClientErrorException e) {
            throw new RuntimeException("Ошибка при отправке сообщения через Telegram: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException("Произошла ошибка при обработке запроса: " + e.getMessage(), e);
        }
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

    @GetMapping("/requestslist/{type}")
    public String getRequestList(@PathVariable String type,
                                 Model model) {
        List<Requests> requests = service.findAllByField(Requests.class, "typeRequest", type);
        List<String> formattedDates = requests.stream()
                .map(request -> formatedDate(request.getCreateDate()))
                .collect(Collectors.toList());
        List<String> updateDate = requests.stream()
                .map(req -> formatedDate(req.getUpdateDate())).toList();
        model.addAttribute("bidList", requests);
        model.addAttribute("formattedBidList", formattedDates);
        model.addAttribute("updateDateList", updateDate);
        model.addAttribute("type", type);
        return "requestslist";
    }
}
