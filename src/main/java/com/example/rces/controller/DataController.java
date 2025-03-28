//package com.example.rces.controller;
//
//import com.example.rces.models.CustomerOrder;
//import com.example.rces.services.DataService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Controller;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestParam;
//ВОЗМОЖНО НУЖНО БУДЕТ ПОТОМ!
//@Controller
//public class DataController {
//
//    @Autowired
//    private DataService dataService;
//
//    @PostMapping("/get-data/{module}/{entity}")
//    public CustomerOrder getData(@PathVariable String module, @PathVariable String entity, @RequestParam String token, @RequestBody String jsonData) {
//        return dataService.getData(module, entity, token, jsonData);
//    }
//
//}

