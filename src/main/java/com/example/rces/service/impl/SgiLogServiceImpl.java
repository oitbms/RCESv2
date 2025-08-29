package com.example.rces.service.impl;

import com.example.rces.models.Employee;
import com.example.rces.models.SGI;
import com.example.rces.models.SgiLog;
import com.example.rces.repository.SgiLogRepository;
import com.example.rces.service.SgiLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static com.example.rces.utils.ServiceUtil.getMetadata;

@Service
@Transactional(transactionManager = "primaryTransactionManager")
public class SgiLogServiceImpl implements SgiLogService {

    private final SgiLogRepository repository;

    @Autowired
    public SgiLogServiceImpl(SgiLogRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<SgiLog> createLog(SGI oldSgi, SGI newSGI, Employee updaterUser) {
        Set<String> ignoredFields = Set.of("id", "createDate", "requestNumber", "color", "log", "chatId", "parentSGI", "subSGI", "executions");
        Map<String, String> metadata = getMetadata(oldSgi.getClass(), ignoredFields, oldSgi, newSGI);
        LocalDateTime now = LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS);
        List<SgiLog> logs = repository.findAllBySgi(oldSgi)
                .stream()
                .filter(log -> log.getDate().equals(now)).toList();
        if (!metadata.isEmpty()) {
            if (logs.isEmpty()) {
                SgiLog log = new SgiLog(newSGI, updaterUser, metadata);
                return List.of(log);
            }
            for (SgiLog log : logs) {
                log.addToMetadata(metadata);
            }
        }
        return logs;
    }
}
