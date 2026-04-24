package com.example.rces.controller.rest;

import com.example.rces.dto.ShiftsRequest;
import com.example.rces.dto.ShiftsResponse;
import com.example.rces.service.ShiftsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shifts")
@Slf4j
@RequiredArgsConstructor
public class ShiftsController {

    private final ShiftsService shiftsService;

    @GetMapping
    public List<ShiftsResponse> getAllShifts() {

        log.info("Получаем список смен");

        List<ShiftsResponse> responses = shiftsService.getAllShifts();

        log.info("Успешно получили список смен, в количестве {}", responses.size());

        return responses;
    }

    @PostMapping
    public ShiftsResponse createShifts(@RequestBody @Validated(ShiftsRequest.Create.class) ShiftsRequest request) {

        log.info("Создаем новую смену - {}", request.getName() );

        ShiftsResponse response = shiftsService.createShifts(request);

        log.info("Смена успешно создана, наименование смены - {}", response.getName());

        return response;
    }

    @PutMapping("/{id}")
    public ShiftsResponse updateShifts(@PathVariable Long id, @RequestBody @Validated(ShiftsRequest.Update.class) @Valid ShiftsRequest request) {

        log.info("Обновляем время смену с ID - {}", id);

        ShiftsResponse response = shiftsService.updateShifts(id, request);

        log.info("Смена с ID - {} успешно обновлена", id);

        return response;
    }

    @DeleteMapping("/{id}")
    public void deleteShifts(@PathVariable Long id) {

        log.info("Удаляем смену c ID - {}", id);

        shiftsService.deleteShifts(id);

        log.info("Смена с ID - {} успешно удалена!", id);

    }

}
