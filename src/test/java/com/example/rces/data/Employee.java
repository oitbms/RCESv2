package com.example.rces.data;

import com.example.rces.dto.EmployeeDTO;
import com.example.rces.dto.SubDivisionDTO;
import net.datafaker.Faker;

import java.util.Locale;

public class Employee {

    public static final EmployeeDTO admin_user = new EmployeeDTO(

    );

    private static final Faker faker = new Faker(new Locale("en"));

    public static EmployeeDTO employeeGenerator() {
        return EmployeeDTO.builder()
                .name(faker.name().firstName() + " " + faker.name().lastName())
                .subDivision(SubDivision.empty_subDivision)
                .role("USER")
                .active(true)
                .chatId(-1L)
                .build();
    }


}
