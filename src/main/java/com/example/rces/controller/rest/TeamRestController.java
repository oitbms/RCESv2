package com.example.rces.controller.rest;

import com.example.rces.dto.RequestDataDTO;
import com.example.rces.dto.TeamCreateDTO;
import com.example.rces.dto.TeamDTO;
import com.example.rces.service.TeamService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.Map;

@RestController
@RequestMapping("/api/team")
public class TeamRestController {

    private final TeamService teamService;

    @Autowired
    public TeamRestController(TeamService teamService) {
        this.teamService = teamService;
    }

    @GetMapping("/get-page")
    public ResponseEntity<RequestDataDTO> getPage() {
        var allTeams = teamService.getAllTeams().stream()
                .sorted(Comparator.comparing(TeamDTO::getId))
                .toList();
        return ResponseEntity.ok(new RequestDataDTO(allTeams, allTeams.size()));
    }

    @PostMapping("/create")
    public ResponseEntity<TeamDTO> createTeam(@Valid @RequestBody TeamCreateDTO dto) {
        var newTeam = teamService.createTeam(dto);
        return ResponseEntity.ok(newTeam);
    }

    @PatchMapping("/update/{id}")
    public ResponseEntity<TeamDTO> update(@PathVariable Long id,
                                          @RequestParam Long version,
                                          @RequestBody Map<String, Object> changes) {
        var updatedTeam = teamService.updateTeam(id, version, changes);
        return ResponseEntity.ok(updatedTeam);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteTeam(@PathVariable Long id) {
        teamService.deleteTeam(id);
        return ResponseEntity.ok().build();
    }
}
