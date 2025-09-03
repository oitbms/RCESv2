package com.example.rces;

import com.example.rces.models.CustomerOrder;
import com.example.rces.models.Employee;
import com.example.rces.models.SGI;
import com.example.rces.models.enums.MlmNode;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class testData {

    public static List<SGI> createTestSgiList() {
        SGI sgi = new SGI();
        sgi.setId(UUID.randomUUID());
        sgi.setRequestNumber(1);
        sgi.setWorkShop("Цех 1");
        sgi.setEvent("Тестовое мероприятие");
        sgi.setActions("Тестовые действия");
        sgi.setDepartment(SGI.Department.mechanic);
        sgi.setDesiredDate(LocalDate.now());
        sgi.setPlanDate(LocalDate.now().plusDays(1));
        sgi.setNote("Тестовая заметка");
        sgi.setComment("Тестовый комментарий");
        sgi.setAgreed(true);
        sgi.setColor(SGI.ColorSGI.GREEN);

        return List.of(sgi);
    }

    public static Employee createEmployee() {
        Employee employee = new Employee();
        employee.setId(1L);
        employee.setName("Test");
        employee.setRole("ADMIN");
        employee.setPassword("123456");
        employee.setActive(true);
        employee.setMlmNode(MlmNode.workShop1);
        employee.setChatId(-1L);
        return employee;
    }

    public static CustomerOrder createCustomerOrder() {
        CustomerOrder customerOrder = new CustomerOrder();
        customerOrder.setId(UUID.randomUUID());
        customerOrder.setName("TestCustomerOrderName");
        customerOrder.setCreateDate(LocalDateTime.now());
        customerOrder.setEmployee(createEmployee());
        return customerOrder;
    }
}
