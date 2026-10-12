package com.example.rces.service;

import com.example.rces.dto.SpmCreateDTO;
import com.example.rces.dto.SpmDTO;
import com.example.rces.models.SPE;
import com.example.rces.models.Spm;

import java.util.List;
import java.util.Map;

public interface SpmService {

    List<SpmDTO> getAllSpm();

    SpmDTO createItem(SpmCreateDTO dto);

    Spm findById(Long id);

    SpmDTO updateSpm(Long id, Long version, Map<String, Object> changes);

    void deleteSpm(Long id);

    List<SpmDTO> createItemFromSpm(List<SpmCreateDTO> listDTO);

    SpmDTO markAsLoaded(Long id);
}
