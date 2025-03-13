//// Контроллер формы создания заявки на вызов конструктора
//package com.example.rces.controller;
//
//import com.example.rces.exception.ResourceNotFoundException;
//import com.example.rces.models.Constructor;
//import com.example.rces.models.enums.Status;
//import com.example.rces.repository.ConstructorRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Controller;
//import org.springframework.ui.Model;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.Date;
//import java.util.UUID;
//
//@Controller
//public class ConstructorBidController {
//
//    @Autowired
//    private ConstructorRepository requestRepository;
//
//    @GetMapping("requestList")
//    public String showRequestList(Model model) {
//        model.addAttribute("request", requestRepository.findAll());
//        model.addAttribute("statusList", Status.values());
//        return "constructoraList";
//    }
//
//    @PostMapping("/updateStatus/{id}")
//    public String updateStatus(@PathVariable UUID id, @RequestParam Status status, @RequestParam boolean accepted) {
//        Constructor constructor = requestRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));
//        if (accepted) {
//            constructor.setStatus(Status.InWork);
//        } else {
//            constructor.setStatus(status);
//        }
//        requestRepository.save(constructor);
//        return "redirect:/requestList";
//    }
//
//    @PostMapping("/acceptRequest/{id}")
//    public String acceptRequest(@PathVariable UUID id) {
//        Constructor constructor = requestRepository.findById(id).orElseThrow();
//        constructor.setAccepted(true);
//        constructor.setDateEndAccepted(new Date());
//        requestRepository.save(constructor);
//        return "redirect:/requestList";
//    }
//
//}
