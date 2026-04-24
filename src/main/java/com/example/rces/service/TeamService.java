package com.example.rces.service;

import com.example.rces.dto.TeamCreateDTO;
import com.example.rces.dto.TeamDTO;

import java.util.List;
import java.util.Map;

public interface TeamService {

    TeamDTO createTeam(TeamCreateDTO dto);

    List<TeamDTO> getAllTeams();

    TeamDTO updateTeam(Long id, Long version, Map<String, Object> changes);

    void deleteTeam(Long id);
}
