//////Контроллер формы просмотра списка заявок конструктора
//package com.example.rces.controller;
//
//import com.example.rces.models.base.EntityBase;
//import com.example.rces.models.enums.Status;
//import com.example.rces.services.UniversalRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Controller;
//import org.springframework.ui.Model;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//
//import java.util.Comparator;
//import java.util.List;
//import java.util.Set;
//
//@Controller
//@RequestMapping("/constructormain")
//public class ConstructorController {
//
//    @Autowired
//    private UniversalRepository repository;
//
//    @GetMapping
//    public String main(
//            @RequestParam(required = false) Set<Status> statuses,
//            Model model
//    ) {
//        List<Constructor> constructorList = repository.findAll(Constructor.class);
//        List<Constructor> filteredList = constructorList.stream()
//                .filter(constructor -> statuses == null || statuses.contains(constructor.getStatus()))
//                .sorted(Comparator.comparing(EntityBase::getRequestNumber))
//                .toList();
//        model.addAttribute("constructorList", filteredList);
//        model.addAttribute("statuses", Status.values());
//
//        return "constructoramain";
//    }
//}
//
