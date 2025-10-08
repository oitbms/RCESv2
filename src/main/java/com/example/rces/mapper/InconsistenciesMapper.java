package com.example.rces.mapper;

import com.example.rces.dto.InconsistencyCreateDto;
import com.example.rces.dto.InconsistencyDto;
import com.example.rces.models.Inconsistency;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface InconsistenciesMapper extends BaseMapper<Inconsistency, InconsistencyDto, InconsistencyCreateDto> {

    Inconsistency toInconsistency(InconsistencyCreateDto inconsistencyCreateDto);

    InconsistencyDto toInconsistenciesDto(Inconsistency inconsistency);

}
