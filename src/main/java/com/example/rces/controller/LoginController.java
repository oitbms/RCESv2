package com.example.rces.controller;

import com.example.rces.configuration.CustomAuthenticationProvider;
import com.example.rces.services.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class LoginController {

    private final CustomAuthenticationProvider customAuthenticationProvider;

    private final CustomUserDetailsService customUserDetailsService;

    @Autowired
    public LoginController(CustomAuthenticationProvider customAuthenticationProvider, CustomUserDetailsService customUserDetailsService) {
        this.customAuthenticationProvider = customAuthenticationProvider;
        this.customUserDetailsService = customUserDetailsService;
    }

    @GetMapping("/loginser")
    public String login() {
        return "login";
    }

    @PostMapping("/loginserr")
    public String login(@RequestParam String username, Model model) {
        try {
            UserDetails user = customUserDetailsService.loadUserByUsername(username);
            if (user == null) {
                model.addAttribute("error", "Пользователь не найден");
                return "login";
            }
            UsernamePasswordAuthenticationToken authRequest =
                    new UsernamePasswordAuthenticationToken(username, null, user.getAuthorities());
            Authentication authentication = customAuthenticationProvider.authenticate(authRequest);

            if (authentication.isAuthenticated()) {
                SecurityContextHolder.getContext().setAuthentication(authentication);
                return "redirect:/registration";
            }
        } catch (AuthenticationException e) {
            model.addAttribute("error", "Ошибка аутентификации: " + e.getMessage());
        }
        return "login";
    }
}
