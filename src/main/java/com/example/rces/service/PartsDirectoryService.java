package com.example.rces.service;

import com.example.rces.dto.PartsDirectoryCreateDTO;
import com.example.rces.dto.PartsDirectoryDTO;

import java.util.List;
import java.util.Map;

public interface PartsDirectoryService {

    List<PartsDirectoryDTO> getAllPartsDirectory();

    PartsDirectoryDTO createItem(PartsDirectoryCreateDTO dto);

    PartsDirectoryDTO updatePdi(Long id, Long version, Map<String, Object> changes);

    void deletePdi(Long id);

    Boolean readyOrNot(Long id, Boolean ready, List<String> operations);

}
