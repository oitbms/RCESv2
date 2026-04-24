package com.example.rces.service;

import com.example.rces.dto.ShiftsRequest;
import com.example.rces.dto.ShiftsResponse;
import com.example.rces.models.Shifts;

import java.util.List;

public interface ShiftsService {

    ShiftsResponse createShifts(ShiftsRequest request);

    ShiftsResponse updateShifts(Long id, ShiftsRequest request);

    void deleteShifts(Long id);

    List<ShiftsResponse> getAllShifts();

    Shifts findById(Long id);

    Shifts getReferenceById(Long id);

}
