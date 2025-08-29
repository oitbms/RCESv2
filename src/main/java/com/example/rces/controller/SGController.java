package com.example.rces.controller;

import com.example.rces.models.SGI;
import com.example.rces.service.SgiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static com.example.rces.utils.ServiceUtil.colorCalculate;

@Controller
@RequestMapping("/sgi")
public class SGController {

    private final SgiService sgiService;

    @Autowired
    public SGController(SgiService sgiService) {
        this.sgiService = sgiService;
    }

    @GetMapping
    public String getSGIForm() {
        return "sgi";
    }

    @DeleteMapping("/delete")
    @ResponseBody
    public void deleteSGI(@RequestBody List<UUID> ids) {
        ids.forEach(id -> sgiService.delete(sgiService.findById(id).orElseThrow(
                () -> new ApplicationContextException("Передан null в списке на удаление SGI"))));
    }

    @PostMapping("/agree")
    public ResponseEntity<Void> coordination(@RequestParam UUID id, @RequestParam Boolean agreed) {
        SGI sgi = sgiService.findById(id).orElseThrow(() -> new ApplicationContextException("Передан null в id SGI на согласование"));
        try {
            sgiService.save(sgi, agreed);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/calculate-color")
    public ResponseEntity<Void> reCalculateColor() {
        LocalDate today = LocalDate.now();
        List<SGI> sgiList = sgiService.findAll();
        for (SGI sgi : sgiList) {
            sgi.setColor(colorCalculate(sgi, today));
        }
        sgiService.saveAll(sgiList);
        return ResponseEntity.ok().build();
    }

}
