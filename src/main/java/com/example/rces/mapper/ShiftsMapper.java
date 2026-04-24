package com.example.rces.mapper;

import com.example.rces.dto.ShiftsRequest;
import com.example.rces.dto.ShiftsResponse;
import com.example.rces.models.Shifts;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface ShiftsMapper {

    Shifts toShifts(ShiftsRequest request);

    ShiftsResponse toShiftsResponse(Shifts shifts);

    List<ShiftsResponse> toShiftsResponse(List<Shifts> shifts);

    Shifts toShiftsUpdate(@MappingTarget Shifts shifts, ShiftsRequest request);

}
