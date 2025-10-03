package com.example.rces.configuration;

import com.example.rces.models.Employee;
import com.example.rces.service.EmployeeService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import java.util.Optional;

@Configuration
@EnableJpaAuditing
public class AuditConfig {

    @Bean
    public AuditorAware<Employee> auditorAware(EmployeeService employeeService) {
        return () -> {
            try {
                return Optional.of(employeeService.getCurrentUser());
            } catch (Exception e) {
                return Optional.empty();
            }
        };
    }
}
