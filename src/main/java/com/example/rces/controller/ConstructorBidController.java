//// Контроллер формы создания заявки на вызов конструктора
package com.example.rces.controller;

import com.example.rces.models.*;
import com.example.rces.models.enums.Status;
import com.example.rces.services.UniversalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.*;

@Controller
public class ConstructorBidController {

    @Autowired
    private UniversalService service;

    @GetMapping("requestList")
    public String showRequestList(Model model) {
        List<Constructor> constructors = service.findAll(Constructor.class);
        List<Employee> employees = service.findAll(Employee.class);
        Status[] statuses = Status.values();
        model.addAttribute("employees", employees);
        model.addAttribute("statuses", statuses);
        model.addAttribute("constructors", constructors);
        return "requestList";
    }

    @GetMapping("requestCanceled")
    public String showRequestCanceled(Model model) {
        model.addAttribute("request", service.findAll(Constructor.class));
        return "requestCanceled";
    }

    @GetMapping("requestCompleted")
    public String showRequestCompleted(Model model) {
        model.addAttribute("request", service.findAll(Constructor.class));
        return "requestCompleted";
    }

    @Transactional
    @PostMapping("/updateStatus/{id}")
    public ResponseEntity<Constructor> updateStatus(
            @PathVariable UUID id,
            @RequestBody StatusUpdateRequest statusUpdateRequest
    ) {
        try {
            Constructor constructor = service.findById(Constructor.class,id);
            if (constructor == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            if (statusUpdateRequest.getStatus().equals("IN_PROGRESS")) {
                constructor.setStatus(Status.WORK);
                constructor.setDateEndAccepted(new Date());
                service.save(constructor);
            }
            return new ResponseEntity<>(constructor, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    @PostMapping("/updateEmployee/{id}")
    public ResponseEntity<Map<String, Object>> updateEmployee(
            @PathVariable UUID id,
            @RequestBody Employee employ // Используем @RequestBody для передачи объекта
    ) {
        // Получаем конструктор по идентификатору
        Constructor constructor = service.findById(Constructor.class, id);

        // Проверяем, найден ли конструктор
        if (constructor == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Объект не найден
        }

        // Обновляем информацию о сотруднике
        constructor.setEmployee(employ);
        service.save(constructor);

        // Создаем ответ в формате Map
        Map<String, Object> response = new HashMap<>();
        response.put("constructor", constructor);
        response.put("message", "Employee updated successfully");

        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    @PostMapping("/acceptRequest/{id}")
    public String acceptRequest(@PathVariable UUID id) {
        Constructor request = service.findById(Constructor.class, id);
        request.setAccepted(true);
        request.setDateEndAccepted(new Date());
        service.save(request);
        return "redirect:/requestList";
    }

    @Transactional
    @PostMapping("/moveDocumentCanceled/{id}")
    public ResponseEntity<Map<String, Object>> requestMoveDocument(
            @PathVariable UUID id,
            @RequestBody Map<String, String> requestBody
    ) {
        Constructor constructor = service.findById(Constructor.class,id);

        constructor.setAccepted(true);

        ConstructorCanceled requestCanceled = new ConstructorCanceled();

        requestCanceled.setName(constructor.getName());
        requestCanceled.setDescription(constructor.getDescription());
        requestCanceled.setCanceledDescription(requestBody.get("reason"));

        String constrName = String.valueOf(constructor.getEmployee());

        requestCanceled.setEmploy(constrName);

        service.save(requestCanceled);
        service.delete(constructor);

        Map<String, Object> success = new HashMap<>();
        success.put("message", "Запрос успешно обновлён");
        return ResponseEntity.ok().body(success);
    }

    @Transactional
    @PostMapping("/moveDocumentCompleted/{id}")
    public ResponseEntity<Constructor> requestMoveDocumentCompleted(@PathVariable UUID id){

        Constructor constructor = service.findById(Constructor.class,id);

        constructor.setAccepted(true);

        constructor.setDateEndAccepted(new Date());

        constructor.setStatus(Status.CLOCED);

        ConstructorCompleted constructorCompleted = new ConstructorCompleted();

        constructorCompleted.setDate(constructor.getDateEndAccepted());
        constructorCompleted.setName(constructor.getName());
        constructorCompleted.setDescription(constructor.getDescription());
        constructorCompleted.setEmploy(constructor.getEmployee().getName());

        service.save(constructorCompleted);

        return new ResponseEntity<>(constructor, HttpStatus.OK);
    }

}
