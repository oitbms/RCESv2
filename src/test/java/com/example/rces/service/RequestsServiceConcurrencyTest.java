package com.example.rces.service;

import com.example.rces.models.Employee;
import com.example.rces.models.Requests;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@SpringBootTest
class RequestsServiceConcurrencyTest {

    @Autowired
    private RequestsService requestsService;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testCreateRequestConcurrency() throws Exception {
        // Подготовка тестовых данных
        Employee create = employeeService.loadUserByUsername("master");
        String employeeJson = "{\"id\":2,\"name\":\"otk\",\"mlmMode\":\"workShop1\",\"role\":\"OTK\",\"chatId\":988785949}";
        String type = "otk";
        String mlmNodeJson = "workShop1";
        String itemJson = "";
        String reasonsJson = "Гидроиспытание";
        Integer qty = 3;
        String control = "ВИК";
        String customerOrderName = "200064";
        String customerOrderJson = "";
        String comment = "";
        String titleJson = "1";

        // Количество потоков
        int threadCount = 2;
        CountDownLatch startLatch = new CountDownLatch(1);
        CountDownLatch finishLatch = new CountDownLatch(threadCount);

        List<Requests> results = Collections.synchronizedList(new ArrayList<>());
        List<Exception> exceptions = Collections.synchronizedList(new ArrayList<>());

        // Запуск потоков
        for (int i = 0; i < threadCount; i++) {
            new Thread(() -> {
                try {
                    startLatch.await(); // Ждем команды старта

                    Requests request = requestsService.createRequest(create
                            , employeeJson, type, mlmNodeJson, itemJson,
                            reasonsJson, qty, control, customerOrderName, customerOrderJson,
                            comment, null, titleJson
                    );
                    results.add(request);

                } catch (Exception e) {
                    exceptions.add(e);
                } finally {
                    finishLatch.countDown();
                }
            }).start();
        }

        // Одновременный старт всех потоков
        startLatch.countDown();
        finishLatch.await(5, TimeUnit.SECONDS); // Ждем завершения 5 секунд

        // Анализ результатов
        System.out.println("Успешно создано заявок: " + results.size());
        System.out.println("Ошибок: " + exceptions.size());

        if (!exceptions.isEmpty()) {
            exceptions.forEach(e -> {
                System.out.println("Ошибка: " + e.getMessage());
                e.printStackTrace();
            });
        }

        // Проверяем номера заявок
        Set<Integer> requestNumbers = results.stream()
                .map(Requests::getRequestNumber)
                .collect(Collectors.toSet());

        System.out.println("Уникальные номера заявок: " + requestNumbers);

        if (requestNumbers.size() < results.size()) {
            System.out.println("НАЙДЕНЫ ДУБЛИКАТЫ! Транзакционность не помогла.");
        } else {
            System.out.println("Дубликатов нет - транзакционность работает!");
        }
    }
}
