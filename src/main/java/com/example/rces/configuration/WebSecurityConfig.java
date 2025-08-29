package com.example.rces.configuration;

import com.example.rces.service.impl.ServiceShit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    private final ServiceShit serviceShit;
    private final CustomAuthenticationProvider customAuthenticationProvider;
    private final AppProperties appProperties;

    @Autowired
    public WebSecurityConfig(ServiceShit serviceShit, CustomAuthenticationProvider customAuthenticationProvider, AppProperties appProperties) {
        this.serviceShit = serviceShit;
        this.customAuthenticationProvider = customAuthenticationProvider;
        this.appProperties = appProperties;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .authorizeHttpRequests((requests) -> requests
                        .requestMatchers("/get-data/**").permitAll()
                        .requestMatchers("/login").permitAll()
                        .requestMatchers("/home").hasAnyAuthority("TECHNOLOGIST", "OTK", "CONSTRUCTOR", "ADMIN", "MASTER")
                        .requestMatchers("/admin", "/registration").hasAuthority("ADMIN")
                        .requestMatchers("/create", "/requestslist/**")
                        .hasAnyAuthority("MASTER", "ADMIN", "CONSTRUCTOR", "TECHNOLOGIST", "OTK", "CONTROL")
                        .requestMatchers("/sgi/**").hasAnyAuthority("ADMIN", "CONTROL", "EVENT")
                        .requestMatchers(new TypeBasedRequestMatcher(serviceShit)).authenticated()
                        .requestMatchers("/api/sgi/test").permitAll()
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .loginPage("/login")
                        .permitAll()
                ).
                logout(logout -> logout
                        .addLogoutHandler(appProperties)
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/login")
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                        .permitAll());

        return http.build();
    }

    @Bean
    public AuthenticationManager authManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder =
                http.getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder.authenticationProvider(customAuthenticationProvider);
        return authenticationManagerBuilder.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}