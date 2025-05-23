//Контроллер главного меню
package com.example.rces.controller;

import com.example.rces.configuration.DeviceDetector;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class Home {

    @Autowired
    private DeviceDetector detector;

    @GetMapping
    public String home(HttpServletRequest request) {
        return "redirect:/menu";
    }

    @GetMapping("mobiledevice")
    public String erorMobile() {
        return "mobiledevice";
    }


}
