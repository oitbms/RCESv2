package com.example.rces.controller.rest;

import com.example.rces.dto.EmployeeCreateDTO;
import com.example.rces.dto.EmployeeDTO;
import com.example.rces.dto.EmployeeUpdateDTO;
import com.example.rces.dto.RequestDataDTO;
import com.example.rces.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/users")
public class EmployeeRestController {

    private final EmployeeService employeeService;

    public EmployeeRestController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    public ResponseEntity<RequestDataDTO> getPage(@RequestParam(required = false) String query,
                                                  @RequestParam(required = false) String role,
                                                  @RequestParam(required = false) Boolean active,
                                                  @RequestParam(required = false) Long subDivisionId,
                                                  @RequestParam(defaultValue = "1") int page,
                                                  @RequestParam(defaultValue = "15") int size,
                                                  @RequestParam(defaultValue = "name") String sort,
                                                  @RequestParam(defaultValue = "asc") String direction) {
        Page<EmployeeDTO> result = employeeService.findPage(query, role, active, subDivisionId, page, size, sort, direction);
        return ResponseEntity.ok(new RequestDataDTO(result.getContent(), result.getTotalElements()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.findById(id));
    }

    @PostMapping
    public ResponseEntity<EmployeeDTO> create(@Valid @RequestBody EmployeeCreateDTO dto) {
        return ResponseEntity.ok(employeeService.create(dto));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<EmployeeDTO> update(@PathVariable Long id,
                                              @RequestParam Long version,
                                              @Valid @RequestBody EmployeeUpdateDTO dto) {
        return ResponseEntity.ok(employeeService.update(id, version, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        employeeService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
