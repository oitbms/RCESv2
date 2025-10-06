package com.example.rces.service;

import com.example.rces.dto.SpeCreateDTO;
import com.example.rces.dto.SpeDTO;

import java.util.List;
import java.util.Map;

public interface SpeService {

    SpeDTO createSPE(SpeCreateDTO dto);

    List<SpeDTO> getAllSPE();

    SpeDTO updateSPE(Integer number, Long version, Map<String, Object> changes);

    void deleteSpe(SpeDTO dto);
}
