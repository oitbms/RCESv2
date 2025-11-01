package com.example.rces.service;

import com.example.rces.dto.*;
import com.example.rces.models.SPE;

import java.util.List;
import java.util.Map;

public interface SpeService {

    SpeDTO createSPE(SpeFgisCreateDTO dto);

    SpeDTO createSPE(SpeCreateDTO dto);

    List<SpeDTO> getAllSPE();

    SpeDTO updateSPE(Integer number, Long version, Map<String, Object> changes);

    DocumentDTO createSpeDocument(Integer number, DocumentCreateDTO dto);

    void deleteSpe(Integer number);

    List<SPE> findAllByIdList(List<Integer> ids);

    void calculateDateVerification();
}
