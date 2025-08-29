package com.example.rces.service;

import com.example.rces.models.SGI;
import org.springframework.core.io.ByteArrayResource;

import java.util.List;
import java.util.UUID;

public interface ReportService {

    List<SGI> getSgiList(List<UUID> ids, String department);

    ByteArrayResource getExcelFile(List<SGI> sgiList);
}
