package com.example.rces.controller;

import com.example.rces.services.TokenService;
import com.example.rces.spm.models.MlmNode;
import com.example.rces.spm.models.ShiftTaskLine;
import com.example.rces.spm.services.SPMService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Controller
@RequestMapping("/shift-task")
public class ShiftTaskController {

    private final SPMService service;

    private TokenService tokenService;

    public ShiftTaskController(SPMService service, TokenService tokenService) {
        this.service = service;
        this.tokenService = tokenService;
    }

    @GetMapping("/task")
    public String task(Model model) throws IOException, InterruptedException {
        List<ShiftTaskLine> componentList = service.findAll(ShiftTaskLine.class).stream()
                .filter(shiftTaskLine -> shiftTaskLine.getCreateDate().toLocalDate().equals(LocalDate.now()))
                .filter(shiftTaskLine -> shiftTaskLine.getQtyFinished().compareTo(shiftTaskLine.getQtyProduction()) < 0)
                .toList();
        List<ShiftTaskLine> componentFinishedList = service.findAll(ShiftTaskLine.class).stream()
                .filter(shiftTaskLine -> shiftTaskLine.getCreateDate().toLocalDate().equals(LocalDate.now()))
                .filter(shiftTaskLine -> shiftTaskLine.getQtyFinished().compareTo(shiftTaskLine.getQtyProduction()) >= 0)
                .toList();
        List<MlmNode> mlmNodeList = service.findAll(MlmNode.class);
        model.addAttribute("token", tokenService.getToken("api","123456"));
        model.addAttribute("mlmNode", mlmNodeList);
        model.addAttribute("valueTaskListSize", componentList.size());
        model.addAttribute("valueFinishedListSize", componentFinishedList.size());
        model.addAttribute("finished", componentFinishedList);
        model.addAttribute("taskList", componentList);
        model.addAttribute("dateStart", LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
        return "task";
    }
}
