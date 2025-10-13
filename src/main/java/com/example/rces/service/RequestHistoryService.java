package com.example.rces.service;

import com.example.rces.dto.RequestHistoryDTO;

import java.util.List;
import java.util.UUID;

public interface RequestHistoryService {

    /**
     *
     * @return Возвращает полную историю для заявок.
     */
    List<RequestHistoryDTO> getDetailedRequestHistory(UUID requestId);
}
