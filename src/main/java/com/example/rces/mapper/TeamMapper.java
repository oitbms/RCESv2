package com.example.rces.mapper;

import com.example.rces.dto.TeamCreateDTO;
import com.example.rces.dto.TeamDTO;
import com.example.rces.models.Team;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TeamMapper extends BaseMapper<Team, TeamDTO, TeamCreateDTO> {

    @Override
    @Mapping(target = "employees", ignore = true)
    Team toEntityFromCreateDTO(TeamCreateDTO createDto);
}
