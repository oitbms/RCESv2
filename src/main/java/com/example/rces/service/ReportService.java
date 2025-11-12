package com.example.rces.service;

import com.example.rces.dto.report.SpeFgisReportModel;
import com.example.rces.models.SGI;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.core.io.ByteArrayResource;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

public interface ReportService {

    List<SGI> getSgiList(List<UUID> ids, String department);

    ByteArrayResource getExcelFile(List<SGI> sgiList);

    byte[] reportBid() throws IOException;

    byte[] createSpeReport(List<Integer> numberList);

    byte[] createSpeFgisReport(JsonNode data);

    byte[] createSpeSchedule(List<Integer> numberList);
}
