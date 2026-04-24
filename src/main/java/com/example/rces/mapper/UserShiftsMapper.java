package com.example.rces.mapper;

import com.example.rces.dto.UserShiftsRequest;
import com.example.rces.dto.UserShiftsResponse;
import com.example.rces.models.UserShifts;
import org.mapstruct.*;

import java.util.List;

@Mapper(
        componentModel = "spring",
        uses = {EmployeeMapper.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface UserShiftsMapper {

    List<UserShiftsResponse> userShiftsResponse(List<UserShifts> userShifts);

    @Mapping(target = "employeeName", source = "userShifts.employee.name")
    @Mapping(target = "shiftName", source = "userShifts.shifts.name")
    UserShiftsResponse userShiftsResponse(UserShifts userShifts);

    UserShifts toUserShifts(UserShiftsRequest userShiftsRequest);

    UserShifts updateUserShifts(@MappingTarget UserShifts userShifts, UserShiftsRequest request);
}
