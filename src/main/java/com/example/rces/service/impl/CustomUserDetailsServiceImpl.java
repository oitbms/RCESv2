package com.example.rces.service.impl;

import com.example.rces.controller.payload.EmployeePayload;
import com.example.rces.models.Employee;
import com.example.rces.models.enums.MlmNode;
import com.example.rces.repository.EmployeeRepository;
import com.example.rces.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextException;
import org.springframework.context.annotation.Bean;
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
@Transactional(transactionManager = "primaryTransactionManager")
public class CustomUserDetailsServiceImpl implements UserDetailsService, EmployeeService {

    private final EmployeeRepository repository;

    @Autowired
    public CustomUserDetailsServiceImpl(EmployeeRepository repository) {
        this.repository = repository;
    }

    @Override
    public void save(String username, String mlmNode, String role, String password, Long chatId) {
        Employee employee = new Employee();
        employee.setName(username);
        employee.setMlmNode(MlmNode.valueOf(mlmNode));
        employee.setRole(role);
        employee.setPassword(password);
        employee.setChatId(chatId != -1 ? chatId : null);
        repository.save(employee);
    }

    @Override
    public void update(Long id, String userName, String mlmNodeName, String roleName, Long chatId, Boolean active) {
        Employee employee = repository.findById(id).orElseThrow(() -> new ApplicationContextException("Пользователь не найден"));
        employee.setName(userName);
        employee.setMlmNode(MlmNode.valueOf(mlmNodeName));
        employee.setRole(roleName);
        employee.setChatId(chatId != -1 ? chatId : null);
        employee.setActive(active);
        repository.save(employee);
    }


    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    @Override
    public Employee loadUserByUsername(String name) {
        try {
            return repository.findByName(name);
        } catch (Exception e) {
            throw new UsernameNotFoundException("Пользователь не найден");
        }
    }

    @Override
    public List<EmployeePayload> findAll() {
        return repository.findAll().stream().map(EmployeePayload::new).toList();
    }

    @Override
    public List<EmployeePayload> findAllByRole(String role) {
        return repository.findAllByRole(role).stream().map(EmployeePayload::new).toList();
    }

    public Employee getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        return (Employee) principal;
    }

    @Override
    public Boolean currentUserHaveControlRoles() {
        return controlRoles.contains(getCurrentUser().getRole());
    }

    @Override
    public Boolean isResponsible(Employee responsobleEmployee) {
        return responsobleEmployee.getId().equals(getCurrentUser().getId());
    }

    @Override
    public void setSecurityContext(Employee employee) {
        Authentication anonymousAuth = new AnonymousAuthenticationToken(
                UUID.randomUUID().toString(),
                employee.getName(),
                List.of(new SimpleGrantedAuthority(employee.getRole())));
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(anonymousAuth);
        SecurityContextHolder.setContext(context);
    }

}