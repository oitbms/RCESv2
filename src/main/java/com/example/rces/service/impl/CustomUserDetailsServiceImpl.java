package com.example.rces.service.impl;

import com.example.rces.dto.EmployeeCreateDTO;
import com.example.rces.dto.EmployeeDTO;
import com.example.rces.dto.EmployeeUpdateDTO;
import com.example.rces.dto.EmployeeWorkCalendarDto;
import com.example.rces.exception.FieldValidationException;
import com.example.rces.mapper.EmployeeMapper;
import com.example.rces.models.Employee;
import com.example.rces.models.SubDivision;
import com.example.rces.models.enums.NotificationType;
import com.example.rces.models.enums.Role;
import com.example.rces.repository.EmployeeRepository;
import com.example.rces.service.EmployeeService;
import com.example.rces.service.SubDivisionService;
import com.example.rces.specifications.EmployeeSpecifications;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

@Service
@Transactional(transactionManager = "primaryTransactionManager")
public class CustomUserDetailsServiceImpl implements UserDetailsService, EmployeeService {

    public final static Set<String> controlRoles = Set.of(
            Role.ADMIN.name(),
            Role.CONTROL.name()
    );

    private final EmployeeRepository repository;
    private final EmployeeMapper mapper;
    private final SubDivisionService subDivisionService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public CustomUserDetailsServiceImpl(EmployeeRepository repository,
                                        EmployeeMapper mapper,
                                        SubDivisionService subDivisionService,
                                        @Lazy PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.mapper = mapper;
        this.subDivisionService = subDivisionService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public EmployeeDTO create(EmployeeCreateDTO createDTO) {
        String name = createDTO.getName().trim();
        if (repository.existsByName(name)) {
            throw new FieldValidationException(HttpStatus.CONFLICT.value(), "name",
                    "Пользователь с таким именем уже существует");
        }

        Role role = parseRole(createDTO.getRole());
        SubDivision subDivision = subDivisionService.findById(createDTO.getSubDivisionId());

        Employee employee = new Employee();
        employee.setName(name);
        employee.setPassword(passwordEncoder.encode(createDTO.getPassword()));
        employee.setRole(role.name());
        employee.setSubDivision(subDivision);
        employee.setChatId(createDTO.getChatId());
        employee.setNotificationApp(createDTO.getNotificationApp());
        employee.setActive(createDTO.getActive() == null || createDTO.getActive());

        Employee saved = repository.saveAndFlush(employee);
        return mapper.toDTO(saved);
    }

    @Override
    public EmployeeDTO update(Long id, Long version, EmployeeUpdateDTO updateDTO) {
        Employee employee = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Пользователь не найден"));

        if (version == null || !Objects.equals(employee.getVersion(), version)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Данные пользователя устарели, обновите страницу");
        }

        String name = updateDTO.getName().trim();
        if (repository.existsByNameAndIdNot(name, id)) {
            throw new FieldValidationException(HttpStatus.CONFLICT.value(), "name",
                    "Пользователь с таким именем уже существует");
        }

        Role newRole = parseRole(updateDTO.getRole());
        boolean newActive = Boolean.TRUE.equals(updateDTO.getActive());
        guardLastActiveAdmin(employee, newRole, newActive);

        SubDivision subDivision = subDivisionService.findById(updateDTO.getSubDivisionId());
        employee.setName(name);
        employee.setRole(newRole.name());
        employee.setSubDivision(subDivision);
        if (updateDTO.getChatId() != null) {
            employee.setChatId(updateDTO.getChatId());
        }
        employee.setNotificationApp(updateDTO.getNotificationApp());
        employee.setActive(newActive);
        if (updateDTO.getPassword() != null && !updateDTO.getPassword().isBlank()) {
            employee.setPassword(passwordEncoder.encode(updateDTO.getPassword()));
        }

        Employee updated = repository.saveAndFlush(employee);
        return mapper.toDTO(updated);
    }

    @Override
    public EmployeeDTO findById(Long id) {
        Employee employee = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Пользователь не найден"));
        return mapper.toDTO(employee);
    }

    @Override
    public Page<EmployeeDTO> findPage(String query,
                                      String role,
                                      Boolean active,
                                      Long subDivisionId,
                                      int page,
                                      int size,
                                      String sort,
                                      String direction) {
        int safePage = Math.max(page, 1) - 1;
        int safeSize = Math.min(Math.max(size, 1), 100);
        Pageable pageable = PageRequest.of(safePage, safeSize, buildSort(sort, direction));
        Specification<Employee> specification = EmployeeSpecifications.filterBy(query, role, active, subDivisionId);
        return repository.findAll(specification, pageable).map(mapper::toDTO);
    }

    @Override
    public void deleteById(Long id) {
        Employee employee = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Пользователь не найден"));

        Employee current = currentUser()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Нет данных о текущем пользователе"));
        if (Objects.equals(current.getId(), id)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Нельзя удалить собственную учётную запись");
        }

        guardLastActiveAdmin(employee, null, false);

        try {
            repository.delete(employee);
            repository.flush();
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Невозможно удалить пользователя: на него ссылаются другие данные. Деактивируйте пользователя.");
        }
    }

    private Role parseRole(String role) {
        try {
            return Role.valueOf(role.trim().toUpperCase());
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new FieldValidationException(HttpStatus.BAD_REQUEST.value(), "role",
                    "Некорректная роль: " + role);
        }
    }

    private void guardLastActiveAdmin(Employee target, Role newRole, boolean newActive) {
        boolean currentlyActiveAdmin = Role.ADMIN.name().equals(target.getRole()) && target.isActive();
        boolean stopsBeingAdmin = newRole == null || newRole != Role.ADMIN || !newActive;
        if (currentlyActiveAdmin && stopsBeingAdmin
                && repository.countActiveByRole(Role.ADMIN.name()) <= 1) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Нельзя удалить или деактивировать последнего активного администратора");
        }
    }

    private Sort buildSort(String sort, String direction) {
        String property = switch (sort == null ? "name" : sort) {
            case "id" -> "id";
            case "role" -> "role";
            case "active" -> "isActive";
            case "subDivision" -> "subDivision.name";
            default -> "name";
        };
        Sort.Direction sortDirection = "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;
        return Sort.by(sortDirection, property);
    }

    @Override
    public Employee loadUserByUsername(String name) {
        try {
            return repository.findByName(name)
                    .orElseThrow(() -> new com.example.rces.exception.UsernameNotFoundException("Пользователь не найден!", NotificationType.ERROR));
        } catch (Exception e) {
            throw new UsernameNotFoundException("Пользователь не найден");
        }
    }

    @Override
    public List<EmployeeDTO> findAll() {
        return repository.findAll().stream()
                .map(mapper::toDTO)
                .toList();
    }

    @Override
    public List<EmployeeWorkCalendarDto> findEmployeeWorkCalendar(String role) {
        return repository.findEmployeeWorkCalendar(role);
    }

    @Override
    public Employee getReferenceById(Long id) {
        return repository.getReferenceById(id);
    }

    @Override
    public List<EmployeeDTO> findAllByRole(String role) {
        return repository.findAllByRole(role).stream()
                .map(mapper::toDTO)
                .toList();
    }

    public static Optional<Employee> currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) return Optional.empty();
        Object principal = authentication.getPrincipal();
        return Optional.ofNullable((Employee) principal);
    }

    public EmployeeDTO getCurrentUserDTO() {
        return mapper.toDTO(currentUser().orElseThrow());
    }

    @Override
    public Employee getCurrentUser() {
        return currentUser().orElseThrow();
    }

    @Override
    public Boolean currentUserHaveControlRoles() {
        return controlRoles.contains(currentUser().orElseThrow().getRole());
    }

    @Override
    public Boolean isResponsible(Employee responsobleEmployee) {
        return responsobleEmployee.getId().equals(currentUser().orElseThrow().getId());
    }

    @Override
    public void setSecurityContext(Employee employee) {
        Authentication auth = new UsernamePasswordAuthenticationToken(
                employee,
                null,
                List.of(new SimpleGrantedAuthority(employee.getRole()))
        );
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(auth);
        SecurityContextHolder.setContext(context);
    }

}
