package com.example.rces.service;

import com.example.rces.dto.MachineCreateDto;
import com.example.rces.dto.MachineDto;
import com.example.rces.models.DocumentFile;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface MachineService {

    List<MachineDto> getAllMachine();

    MachineDto findByNumber(Integer number);

    MachineDto createMachine(MachineCreateDto createDto);

    MachineDto updateMachine(MachineDto machineDto);

    void deleteMachineByNumber(Integer number);

    void addPdfToMachine(Integer machineNumber, MultipartFile[] files);

    void updateOtherText(Integer number, String text);

    void addOtherDocuments(Integer number, MultipartFile[] files);

    DocumentFile getMachineFile(UUID fileId);

    void deleteMachineFile(UUID fileId);

}
