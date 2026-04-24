package com.example.rces.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalTime;

@Data
public class ShiftsRequest {

    @NotNull(groups = {Update.class})
    private Long id;

    @NotNull(message = "Наименование смены должно быть указано!")
    private String name;

    @NotNull(message = "Время начала смены должно быть указано!")
    private LocalTime startTime;

    @NotNull(message = "Время завершения смены должно быть указано!")
    private LocalTime endTime;

    public interface Create {}
    public interface Update {}

}
