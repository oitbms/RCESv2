package com.example.rces.service;

import com.example.rces.dto.SpeCreateDTO;
import com.example.rces.dto.SpeDTO;

import java.util.List;

public interface SpeService {

    SpeDTO createSPE(SpeCreateDTO dto);

    List<SpeDTO> getAllSPE();

    SpeDTO updateSPE(SpeDTO dto);

    void deleteSpe(SpeDTO dto);
}
