package com.example.rces.services;

import com.example.rces.models.Employee;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import static com.example.rces.utils.ServiceUtil.controlRoles;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UniversalRepository universalRepository;

    @Override
    @Transactional(readOnly = true)
    public Employee loadUserByUsername(String username) {
        try {
            return universalRepository.findSingleByField(Employee.class, "name", username);
        } catch (Exception e) {
            throw new UsernameNotFoundException("Пользователь не найден");
        }
    }

    public Boolean isControl() {
        return controlRoles.contains(currentUser().getRole());
    }

    public Boolean isResponsible(Employee responsobleEmployee) {
        return responsobleEmployee.getId().equals(currentUser().getId());
    }

    public Employee currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return loadUserByUsername(authentication.getName());
    }

    private void setSecurityContext(Employee employee) {
        Authentication anonymousAuth = new AnonymousAuthenticationToken(
                UUID.randomUUID().toString(),
                employee.getName(),
                List.of(new SimpleGrantedAuthority(employee.getRole())));
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(anonymousAuth);
        SecurityContextHolder.setContext(context);
    }
}