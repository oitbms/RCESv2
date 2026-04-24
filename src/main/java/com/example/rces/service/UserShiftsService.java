package com.example.rces.service;

import com.example.rces.dto.EmployeeWorkCalendarDto;
import com.example.rces.dto.UserShiftsRequest;
import com.example.rces.dto.UserShiftsResponse;

import java.util.List;

public interface UserShiftsService {

    UserShiftsResponse createUserShifts(UserShiftsRequest userShifts);

    UserShiftsResponse updateUserShifts(Long id, UserShiftsRequest userShifts);

    void deleteUserShifts(long id);

    List<UserShiftsResponse> getAllUserShifts();

    List<EmployeeWorkCalendarDto> findByEmployeesAndRole(String role);

    UserShiftsResponse getUserShifts(Long id);
}
