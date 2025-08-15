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
//
//import java.util.List;
//
//@Controller
//public class DataController {
//    @Autowired
//    private DataService dataService;
//
//    @PostMapping("/get-data/{currentModule}/{entity}")
//    public List<String> getData(@PathVariable String currentModule, @PathVariable String entity, @RequestParam String token, @RequestBody String jsonData) {
//        return dataService.getData(currentModule, entity, token, jsonData);
//    }
//}
