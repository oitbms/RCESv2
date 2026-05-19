package com.example.rces.service.impl;

import com.example.rces.dto.TeamCreateDTO;
import com.example.rces.dto.TeamDTO;
import com.example.rces.mapper.TeamMapper;
import com.example.rces.models.Employee;
import com.example.rces.models.Team;
import com.example.rces.repository.EmployeeRepository;
import com.example.rces.repository.TeamRepository;
import com.example.rces.service.TeamService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.OptimisticLockException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@Transactional(transactionManager = "primaryTransactionManager")
public class TeamServiceImpl implements TeamService {

    private final TeamRepository teamRepository;
    private final TeamMapper teamMapper;
    private final EmployeeRepository employeeRepository;
    private final ObjectMapper objectMapper;

    @Autowired
    public TeamServiceImpl(TeamRepository teamRepository, TeamMapper teamMapper,
                           EmployeeRepository employeeRepository, ObjectMapper objectMapper) {
        this.teamRepository = teamRepository;
        this.teamMapper = teamMapper;
        this.employeeRepository = employeeRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public TeamDTO createTeam(TeamCreateDTO dto) {
        Team team = teamMapper.toEntityFromCreateDTO(dto);

        if (dto.getEmployeeIds() != null && !dto.getEmployeeIds().isEmpty()) {
            List<Employee> employees = employeeRepository.findAllById(dto.getEmployeeIds());
            team.setEmployees(employees);
        }

        Team savedTeam = teamRepository.save(team);
        return teamMapper.toDTO(savedTeam);
    }

    @Override
    public List<TeamDTO> getAllTeams() {
        return teamMapper.toDTOList(teamRepository.findAll());
    }

    @Override
    public TeamDTO updateTeam(Long id, Long version, Map<String, Object> changes) {
        Team team = teamRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(String.format("Бригада с id %s не найдена", id)));

        if (!team.getVersion().equals(version)) {
            throw new OptimisticLockException("Бригада с id " + id + " устарела");
        }

        Map<String, Object> scalarChanges = new HashMap<>(changes);
        boolean employeesChanged = scalarChanges.containsKey("employeeIds");
        List<Long> employeeIds = employeesChanged ? extractEmployeeIds(scalarChanges.remove("employeeIds")) : List.of();

        try {
            objectMapper.readerForUpdating(team)
                    .readValue(objectMapper.writeValueAsBytes(scalarChanges));
        } catch (Exception e) {
            throw new ApplicationContextException("Ошибка при обновлении бригады", e);
        }

        if (employeesChanged) {
            List<Employee> employees = employeeIds.isEmpty() ? List.of() : employeeRepository.findAllById(employeeIds);
            team.getEmployees().clear();
            team.getEmployees().addAll(employees);
        }

        Team savedTeam = teamRepository.saveAndFlush(team);
        return teamMapper.toDTO(savedTeam);
    }

    private List<Long> extractEmployeeIds(Object rawEmployeeIds) {
        if (rawEmployeeIds == null) {
            return List.of();
        }

        List<Long> employeeIds = objectMapper.convertValue(rawEmployeeIds, new TypeReference<>() {
        });

        return employeeIds.stream()
                .filter(Objects::nonNull)
                .distinct()
                .toList();
    }

    @Override
    public void deleteTeam(Long id) {
        if (!teamRepository.existsById(id)) {
            throw new EntityNotFoundException(String.format("Бригада с id %s не найдена", id));
        }
        teamRepository.deleteById(id);
    }
}
