package com.example.rces.services;

import com.example.rces.models.Employee;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UniversalRepository universalRepository;

    @Override
    public Employee loadUserByUsername(String username) throws UsernameNotFoundException {
        Employee employee = universalRepository.findSingleByField(Employee.class, "name", username);
        if (employee == null) {
            throw new UsernameNotFoundException("Пользователь не найден");
        }
        return employee;
    }
}