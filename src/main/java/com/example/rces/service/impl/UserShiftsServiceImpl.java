package com.example.rces.service.impl;

import com.example.rces.dto.EmployeeWorkCalendarDto;
import com.example.rces.dto.UserShiftsRequest;
import com.example.rces.dto.UserShiftsResponse;
import com.example.rces.mapper.UserShiftsMapper;
import com.example.rces.models.Employee;
import com.example.rces.models.Shifts;
import com.example.rces.models.UserShifts;
import com.example.rces.repository.UserShiftsRepository;
import com.example.rces.service.EmployeeService;
import com.example.rces.service.ShiftsService;
import com.example.rces.service.UserShiftsService;
import jakarta.ws.rs.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class UserShiftsServiceImpl implements UserShiftsService {

    private final UserShiftsRepository userShiftsRepository;

    private final UserShiftsMapper userShiftsMapper;

    private final EmployeeService employeeService;

    private final ShiftsService shiftsService;

    @Override
    @Transactional
    public UserShiftsResponse createUserShifts(UserShiftsRequest request) {

        Employee employee = employeeService.getReferenceById(request.getEmployeeId());

        Shifts shift = shiftsService.getReferenceById(request.getShiftId());

        validateUserShifts(employee, shift);

        UserShifts userShifts = userShiftsMapper.toUserShifts(request);
        userShifts.setEmployee(employee);
        userShifts.setShifts(shift);

        userShiftsRepository.save(userShifts);

        UserShiftsResponse response = userShiftsMapper.userShiftsResponse(userShifts);

        log.info("Смена назначена сотруднику с ID: {}", userShifts.getEmployee().getId());

        return response;

    }

    @Override
    @Transactional
    public UserShiftsResponse updateUserShifts(Long id, UserShiftsRequest request) {

        UserShifts userShifts = userShiftsRepository.findById(id).orElseThrow(() -> new NotFoundException("Не найдено!"));

        Employee employee = employeeService.getReferenceById(request.getEmployeeId());

        Shifts shift = shiftsService.getReferenceById(request.getShiftId());

        userShifts.setEmployee(employee);
        userShifts.setShifts(shift);

        userShiftsRepository.save(userShiftsMapper.updateUserShifts(userShifts, request));

        UserShiftsResponse response = userShiftsMapper.userShiftsResponse(userShifts);

        return response;
    }

    @Override
    @Transactional
    public void deleteUserShifts(long id) {

        if (!userShiftsRepository.existsById(id)) {
            throw new NotFoundException("Запись не найдена, ID: " + id);
        }
        userShiftsRepository.deleteById(id);

        log.info("Удалена смена с ID: {}", id);

    }

    @Override
    public List<UserShiftsResponse> getAllUserShifts() {

        List<UserShifts> userShifts = userShiftsRepository.findAll();

        return userShiftsMapper.userShiftsResponse(userShifts);
    }

    @Override
    public List<EmployeeWorkCalendarDto> findByEmployeesAndRole(String role) {

        List<EmployeeWorkCalendarDto> employeeWorkCalendarList = employeeService.findEmployeeWorkCalendar(role);

        return employeeWorkCalendarList;
    }

    @Override
    public UserShiftsResponse getUserShifts(Long id) {

        UserShiftsResponse response = userShiftsMapper.userShiftsResponse(userShiftsRepository.findByEmployee_Id(id));

        return response;
    }

    private void validateUserShifts(Employee employee, Shifts shift) {

        if (userShiftsRepository.existsByEmployee_IdAndShifts_Id(employee.getId(), shift.getId())) {
            throw new RuntimeException("Пользователь пытается присвоить уже существующую у него смену!");
        }

    }
}
