package com.example.rces.service;

import com.example.rces.dto.*;
import com.example.rces.models.Employee;
import com.example.rces.models.PartsDirectory;
import com.example.rces.models.SPE;
import com.example.rces.models.Spm;

import java.util.List;
import java.util.Map;

public interface PartsDirectoryService {

    List<PartsDirectoryDTO> getAllPartsDirectory();

    PartsDirectoryDTO createItem(PartsDirectoryCreateDTO dto);

    PartsDirectoryDTO updatePdi(Long id, Long version, Map<String, Object> changes);

    void deletePdi(Long id);

    PartsDirectoryDTO updateOperations(Long id, List<String> operations);

    PartsDirectoryDTO updatePerformedOperations(Long id, List<String> performedOperations);

    PartsDirectoryFrom1C downloadFrom1C(String customerOrder);

    List<PartsDirectoryDTO> createItemFrom1C(List<PartsDirectoryCreateDTOFrom1C> listDTO);

    List<PartsDirectoryDTO> createItemFromSpm(List<PartsDirectoryCreateDTOFromSpm> listDTO);

}
