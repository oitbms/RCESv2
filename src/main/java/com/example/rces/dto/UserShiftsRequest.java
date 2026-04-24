package com.example.rces.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserShiftsRequest {

    @NotNull(groups = Update.class)
    private Long id;

    @NotNull(message = "Пользователь должен быть указан")
    private Long employeeId;

    @NotNull(message = "Смена должна быть указана")
    private Long shiftId;

    @NotNull(message = "Дата начала смены должна быть указана")
    private LocalDate startDate;

    private LocalDate endDate;

    public interface Create {}
    public interface Update {}

}
