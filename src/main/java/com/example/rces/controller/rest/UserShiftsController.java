package com.example.rces.controller.rest;

import com.example.rces.dto.UserShiftsRequest;
import com.example.rces.dto.UserShiftsResponse;
import com.example.rces.service.UserShiftsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-shifts")
@RequiredArgsConstructor
@Slf4j
public class UserShiftsController {

    private final UserShiftsService userShiftsService;

    @GetMapping
    public List<UserShiftsResponse> getUserShifts() {

        log.info("Получаем информацию о назначенный сменах");

        List<UserShiftsResponse> response = userShiftsService.getAllUserShifts();

        return response;

    }

    @PostMapping
    public UserShiftsResponse createUserShifts(@RequestBody @Validated(UserShiftsRequest.Create.class) UserShiftsRequest request) {

        log.info("Назначаем пользователю с ID: {} смену", request.getEmployeeId());

        UserShiftsResponse response = userShiftsService.createUserShifts(request);

        return response;
    }

    @PutMapping("/{id}")
    public UserShiftsResponse updateUserShifts(@PathVariable Long id, @RequestBody @Validated(UserShiftsRequest.Update.class) UserShiftsRequest request) {

        log.info("Обновляем у пользователя с ID: {} смену", request.getEmployeeId());

        UserShiftsResponse response = userShiftsService.updateUserShifts(id, request);

        return response;
    }

    @DeleteMapping("/{id}")
    public void deleteUserShifts(@PathVariable Long id) {

        log.info("Удаляем смену с ID: {}", id);

        userShiftsService.deleteUserShifts(id);

    }
}
