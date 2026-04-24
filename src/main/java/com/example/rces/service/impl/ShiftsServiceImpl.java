package com.example.rces.service.impl;

import com.example.rces.dto.ShiftsRequest;
import com.example.rces.dto.ShiftsResponse;
import com.example.rces.mapper.ShiftsMapper;
import com.example.rces.models.Shifts;
import com.example.rces.repository.ShiftsRepository;
import com.example.rces.service.ShiftsService;
import jakarta.ws.rs.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ShiftsServiceImpl implements ShiftsService {

    private final ShiftsRepository shiftsRepository;

    private final ShiftsMapper shiftsMapper;

    @Override
    @Transactional
    public ShiftsResponse createShifts(ShiftsRequest request) {

        validateStartTime(request);

        Shifts shifts = shiftsMapper.toShifts(request);

        shiftsRepository.save(shifts);

        ShiftsResponse response = shiftsMapper.toShiftsResponse(shifts);

        return response;
    }

    @Override
    @Transactional
    public ShiftsResponse updateShifts(Long id, ShiftsRequest request) {

        validateStartTime(request);

        Shifts shifts = shiftsRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Указанная смена с ID - " + id + " не найдена!"));

        Shifts updatedShifts = shiftsMapper.toShiftsUpdate(shifts, request);

        shiftsRepository.save(updatedShifts);

        ShiftsResponse response = shiftsMapper.toShiftsResponse(updatedShifts);

        return response;
    }


    @Override
    @Transactional
    public void deleteShifts(Long id) {

        if (!shiftsRepository.existsById(id)) {
            throw new NotFoundException("Указанная смены не найдена!");
        }

        shiftsRepository.deleteById(id);
    }

    @Override
    public List<ShiftsResponse> getAllShifts() {

        List<ShiftsResponse> responseList = shiftsMapper.toShiftsResponse(shiftsRepository.findAll());

        return responseList;
    }

    @Override
    public Shifts findById(Long id) {
        return shiftsRepository.findById(id).orElseThrow(() -> new NotFoundException("Смена не найдена ID - " + id));
    }

    @Override
    public Shifts getReferenceById(Long id) {
        return shiftsRepository.getReferenceById(id);
    }

    private void validateStartTime(ShiftsRequest request) {

        if (request.getEndTime().isBefore(request.getStartTime())) {
            throw new RuntimeException("Время окончания смены не может быть раньше времени начала");
        }

        if (request.getStartTime().equals(request.getEndTime())) {
            throw new RuntimeException("Время начала и окончания смены не могут совпадать");
        }

        if (shiftsRepository.existsByName(request.getName())) {
            throw new RuntimeException("Смена с названием '" + request.getName() + "' уже существует");
        }
    }

}
