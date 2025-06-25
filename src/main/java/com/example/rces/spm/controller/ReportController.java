package com.example.rces.spm.controller;

import com.example.rces.spm.models.CustomerOrderLine;
import com.example.rces.spm.models.JobComponent;
import com.example.rces.spm.models.PrimaryDemand;
import com.example.rces.spm.models.SPMCustomerOrder;
import com.example.rces.spm.services.SPMService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/report")
public class ReportController {

    private final SPMService service;

    public ReportController(SPMService service) {
        this.service = service;
    }

    @GetMapping
    public String getReportForm(Model model) {
        return "report/tree";
    }

    @PostMapping
    public String makeReport(@RequestParam(required = false) SPMCustomerOrder customerOrder) {
        List<PrimaryDemand> primaryDemandList = customerOrder.getLines()
                .stream()
                .sorted(Comparator.comparing(CustomerOrderLine::getNumber))
                .map(col -> service.findById(PrimaryDemand.class, col.getId()))
                .toList();
        Map<PrimaryDemand, JobComponent> primaryDemandMainJobComponentMap = primaryDemandList
                .stream()
                .collect(Collectors.toMap(pd -> pd, service.getPrimaryDemandService()::getMainJobComponentForPrimaryDemand));

        return "report/tree";
    }

}
