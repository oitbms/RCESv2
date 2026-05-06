package com.example.rces.service;

import com.example.rces.dto.PartsDirectoryCreateDTO;
import com.example.rces.dto.PartsDirectoryCreateDTOFrom1C;
import com.example.rces.dto.PartsDirectoryDTO;
import com.example.rces.dto.PartsDirectoryFrom1C;

import java.util.List;
import java.util.Map;

public interface PartsDirectoryService {

    List<PartsDirectoryDTO> getAllPartsDirectory();

    PartsDirectoryDTO createItem(PartsDirectoryCreateDTO dto);

    PartsDirectoryDTO updatePdi(Long id, Long version, Map<String, Object> changes);

    void deletePdi(Long id);

    PartsDirectoryDTO readyOrNot(Long id, Boolean ready, List<String> operations);

    PartsDirectoryFrom1C downloadFrom1C(String customerOrder);

    List<PartsDirectoryDTO> createItemFrom1C(List<PartsDirectoryCreateDTOFrom1C> listDTO);

}
