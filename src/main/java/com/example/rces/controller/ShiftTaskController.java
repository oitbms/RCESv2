package com.example.rces.controller;

import com.example.rces.services.TokenService;
import com.example.rces.spm.models.MlmNode;
import com.example.rces.spm.models.ShiftTaskLine;
import com.example.rces.spm.services.SPMService;
import com.example.rces.spm.services.service.BProcessDocStep;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/shift-task")
public class ShiftTaskController {

    private final SPMService service;
    private final TokenService tokenService;

    @Autowired
    private BProcessDocStep bpStep;

    public ShiftTaskController(SPMService service, TokenService tokenService) {
        this.service = service;
        this.tokenService = tokenService;
    }

    @GetMapping("/task")
    public String task(Model model) throws IOException, InterruptedException {

        List componentList = service.getEntityManager()
                .createNativeQuery("SELECT * FROM jm_shift_task_line" +
                        " WHERE CAST(created_at AS DATE) = date(' " + LocalDate.now() + "')",
                        ShiftTaskLine.class)
                .getResultList();

        List componentFinishedList = service.getEntityManager()
                .createNativeQuery(
                        "SELECT * FROM jm_shift_task_line " +
                                "WHERE (CAST(created_at AS DATE) = date(' " + LocalDate.now() + "') AND qty_finished >= qty_production)",
                        ShiftTaskLine.class)
                .getResultList();

        List<MlmNode> mlmNodeList = service.findAll(MlmNode.class);

        model.addAttribute("token", tokenService.getToken("api", "123456"));
        model.addAttribute("mlmNode", mlmNodeList);
        model.addAttribute("valueTaskListSize", componentList.size());
        model.addAttribute("valueFinishedListSize", componentFinishedList.size());
        model.addAttribute("finished", componentFinishedList);
        model.addAttribute("taskList", componentList);
        model.addAttribute("dateStart", LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));

        return "task";
    }

    @PostMapping("/create-document")
    public void createDocument(@RequestBody Map<String, Long> payload) throws IOException, InterruptedException {
        Long idStr = payload.get("primarydemand_list");
        bpStep.createDoc(idStr);
    }
}