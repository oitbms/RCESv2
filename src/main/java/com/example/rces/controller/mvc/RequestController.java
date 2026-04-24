package com.example.rces.controller.mvc;

import com.example.rces.dto.*;
import com.example.rces.mapper.SubDivisionMapper;
import com.example.rces.models.Employee;
import com.example.rces.models.Requests;
import com.example.rces.service.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

import static com.example.rces.service.impl.CustomUserDetailsServiceImpl.currentUser;
import static com.example.rces.utils.DateUtil.formatedDate;


@Controller
@Slf4j
public class RequestController {

    private final RequestsService requestsService;
    private final SubDivisionMapper subDivisionMapper;
    private final RequestHistoryService requestHistoryService;
    private final EmployeeService employeeService;
    private final SubDivisionService subDivisionService;
    private final UserShiftsService userShiftsService;

    @Autowired
    public RequestController(RequestsService requestsService,
                             SubDivisionMapper subDivisionMapper, RequestHistoryService requestHistoryService,
                             EmployeeService employeeService, SubDivisionService subDivisionService, UserShiftsService userShiftsService) {
        this.requestsService = requestsService;
        this.subDivisionMapper = subDivisionMapper;
        this.requestHistoryService = requestHistoryService;
        this.employeeService = employeeService;
        this.subDivisionService = subDivisionService;
        this.userShiftsService = userShiftsService;
    }


    /**
     *
     * @param type Отдел для которого создается заявка
     * @param model
     * @return Возвращаем форму создания заявки
     */
    @GetMapping("/create")
    public String getCreateBidForm(@RequestParam String type, Model model) {

        if (!Requests.Type.isValid(type)) {
            model.addAttribute("type", type);
            return "error";
        }

        Employee employee = currentUser().orElseThrow();
        List<SubDivisionDTO> subDivisionDTOList = subDivisionService.getAll();

        log.info("Запрос на создание заявки от пользователя: {}, для отдела: {}", employee.getName(), type);

        model.addAttribute("createForm", true);
        model.addAttribute("type", type);
        model.addAttribute(type, true);
        model.addAttribute("employeeName", employee.getName());
        model.addAttribute("mlmNodeEmployee", subDivisionMapper.toDTO(employee.getSubDivision()));
        model.addAttribute("subDivision", subDivisionDTOList);

        return "/requests";
    }

    /**
     *
     * @param createRequestDto созданная пользователем заявка
     * @param model
     * @param additionalFiles прикрепленные фото
     * @return создает заявку
     * @throws JsonProcessingException
     */
    @PostMapping("/create")
    public String createRequest(@ModelAttribute CreateRequestDto createRequestDto, Model model,
                                @RequestParam("additionalFiles") MultipartFile[] additionalFiles) throws JsonProcessingException {

        log.info("Запрос на создание заявки, Request - {}", createRequestDto);

        Employee createdEmployee = currentUser().orElseThrow();
        RequestDto requestDto = requestsService.createRequest(createdEmployee, createRequestDto, additionalFiles);
        model.addAttribute("create", true);
        model.addAttribute("requestNumber", requestDto.getRequestNumber());

        log.info("Заявка успешно создана! Номер заявки RequestNumber: {}", requestDto.getRequestNumber());

        return "success";
    }

    /**
     *
     * @param requestNumber Номер заявки которую хотим просмотреть/отредактировать
     * @param model
     * @return Возвращает заявку по номеру
     */
    @GetMapping("/view/{requestNumber}")
    public String getViewBidForm(@PathVariable("requestNumber") Integer requestNumber, Model model) {

        log.info("Запрос на просмотр заявки с RequestNumber: {}", requestNumber);

        Requests requests = requestsService.findByRequestNumber(requestNumber);
        Employee user = currentUser().orElseThrow();

        List<RequestHistoryDTO> requestHistoryDTOList = new ArrayList<>();
        if (requests.getQtyRejected() > 0) {
            requestHistoryDTOList = requestHistoryService.getRequestHistory(requests.getId());
        }

        model.addAttribute("bid", requests);
        model.addAttribute("type", requests.getTypeRequest());
        model.addAttribute("date", formatedDate(requests.getCreatedDate()));
        model.addAttribute("viewForm", true);
        model.addAttribute("requestHistoryDTOList", requestHistoryDTOList);
        model.addAttribute("employeeMaster", employeeService.findAllByRole("MASTER"));
        model.addAttribute("role", user.getRole());

        log.info("Форма просмотра/редактирования заявки с RequestNumber - {} успешно открыта!", requestNumber);

        return "/requests";
    }

    /**
     *
     * @param type Наименование отдела(Аббревиатура)
     * @param model
     * @return Возвращает все заявки указанного в параметрах отдела, за форму отвечает BootstrapTable
     */
    @GetMapping("/requestslist/{type}")
    public String getRequestList(@PathVariable String type,
                                 Model model) {

        log.info("Запрос на открытие формы с заявками для отдела - {}", type);

        List<Requests> requestsList = requestsService.findAllByTypeRequest(Requests.Type.valueOf(type)).stream()
                .sorted(Comparator.comparing(Requests::getRequestNumber).reversed())
                .toList();
        List<String> formattedDates = requestsList.stream()
                .map(request -> formatedDate(request.getCreatedDate()))
                .toList();
        List<String> updateDate = requestsList.stream()
                .map(requests -> requests.getUpdatedDate().atZone(ZoneId.of("UTC")).format(DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm")))
                .toList();

        model.addAttribute("requestsList", requestsList);
        model.addAttribute("typeRequest", type);
        model.addAttribute("formattedBidList", formattedDates);
        model.addAttribute("updateDateList", updateDate);

        log.info("Форма заявок для отдела - {} успешно загружена", type);

        return "requestslist";
    }

    @GetMapping("/work-calendar/{role}")
    public String showSchedule(Model model, @PathVariable String role) {

        List<EmployeeWorkCalendarDto> employeeWorkCalendarList = userShiftsService.findByEmployeesAndRole(role);

        model.addAttribute("employeeDTOList", employeeWorkCalendarList);

        return "work-calendar";
    }

}
