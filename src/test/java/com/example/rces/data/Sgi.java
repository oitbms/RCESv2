package com.example.rces.data;

import com.example.rces.dto.SgiCreateDTO;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static com.example.rces.utils.DateUtil.formatedDate;

public class Sgi {

    public static final SgiCreateDTO createDTO = new SgiCreateDTO(
            "Тестовый участок", "Тестовое мероприятие" + LocalDate.now(), "Тестовые действия",
            "energy", Employee.admin_user, LocalDate.now(), formatedDate(LocalDateTime.now()) + " ТЕСТ", null);

}
