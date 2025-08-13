package com.example.rces.spm.controller;

import com.example.rces.spm.models.CustomerOrderLine;
import com.example.rces.spm.models.JobComponent;
import com.example.rces.spm.models.PrimaryDemand;
import com.example.rces.spm.models.SPMCustomerOrder;
import com.example.rces.spm.services.SPMService;
import com.example.rces.spm.services.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/report")
public class ReportController {

    private final SPMService spmService;
    private final ReportService reportService;

    @Autowired
    public ReportController(SPMService spmService, ReportService reportService) {
        this.spmService = spmService;
        this.reportService = reportService;
    }

    @GetMapping
    public String getReportForm(Model model) {
        return "report/tree";
    }

    @PostMapping
    public String makeReport(@RequestParam(required = false) SPMCustomerOrder customerOrder) {


        return "report/tree";
    }

    @GetMapping("/print")
    public ResponseEntity<Resource> uploadToExcel(@RequestParam Long customerOrderId) {
        try {
            ByteArrayResource resource = reportService.makeCustomerOrderTreeReport(customerOrderId);
            String filename = String.format("Дерево ЗК от %s.xlsx", LocalDate.now());
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .contentLength(resource.contentLength())
                    .body(resource);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }

    }
}
