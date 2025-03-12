//Контроллер формы просмотра списка заявок конструктора
package com.example.rces.controller;

import com.example.rces.models.Constructor;
import com.example.rces.repository.ConstructorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.Date;

@Controller
public class ConstructorController {

    @Autowired
    private ConstructorRepository requestRepository;

    @GetMapping("/requestForm")
    public String showRequestForm(Model model) {
        Constructor constructor = new Constructor();
        model.addAttribute("request", constructor);
        return "constructorForm";
    }

    @PostMapping("/submitRequest")
    public String submitRequest(@ModelAttribute Constructor constructor,
                                @RequestParam("additionalFiles") MultipartFile[] additionalFiles) {
        try {
            if (additionalFiles.length > 0 && !additionalFiles[0].isEmpty()) {
                byte[] imageBytes = additionalFiles[0].getBytes();
                String base64Image = Base64.getEncoder().encodeToString(imageBytes);
                constructor.setImage(base64Image); // Сохраняем строку Base64
            }
            constructor.setDateStartAccepted(new Date());
            constructor.setAccepted(false); // По умолчанию заявка не принята
            requestRepository.save(constructor);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "redirect:/requestList";
    }
}

