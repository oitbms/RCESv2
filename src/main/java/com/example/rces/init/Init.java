package com.example.rces.init;

import com.example.rces.dto.DocumentCreateDTO;
import com.example.rces.models.ExecutedRunOnceScripts;
import com.example.rces.models.SPE;
import com.example.rces.service.EmployeeService;
import com.example.rces.service.ReportService;
import com.example.rces.service.SpeService;
import com.example.rces.utils.ApiClient;
import com.fasterxml.jackson.databind.JsonNode;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextException;
import org.springframework.stereotype.Component;
import org.springframework.transaction.support.TransactionTemplate;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class Init {

    @PersistenceContext
    private EntityManager em;
    private final TransactionTemplate transactionTemplate;
    private List<String> runOnceList = new ArrayList<>();
    protected static Logger log = LoggerFactory.getLogger(Init.class);

    private final SpeService speService;
    private final ReportService reportService;
    private final ApiClient apiClient;
    private final EmployeeService employeeService;

    @Autowired
    public Init(TransactionTemplate transactionTemplate, SpeService speService, ReportService reportService, ApiClient apiClient, EmployeeService employeeService) {
        this.transactionTemplate = transactionTemplate;
        this.speService = speService;
        this.reportService = reportService;
        this.apiClient = apiClient;
        this.employeeService = employeeService;
    }


    @PostConstruct
    protected void initialize() {
        this.updateRunOnceListCache();
        try {
            this.employeeService.setSecurityContext(employeeService.loadUserByUsername("system"));
            this.init();
        } catch (Exception e) {
            throw new RuntimeException("Ошибка PostConstruct в Init", e);
        }
    }

    private void init() {
        log.info("Инициализация приложения");
        runOnce("#1-Перерасчет дат метрологии", speService::calculateDateVerification, true);
        runOnce("#2-Установка документов в SPE", this::installDocumentOnSPE, true);
    }

    private void installDocumentOnSPE() {
        List<SPE> speList = em.createQuery(
                "SELECT e FROM SPE e WHERE e.document.id IS NULL",
                SPE.class
        ).getResultList();
        Map<String, SPE> speByOutNumber = speList.stream()
                .collect(Collectors.toMap(
                        SPE::getOutNumber,
                        Function.identity(),
                        (existing, replacement) -> existing
                ));
        List<JsonNode> fgisData = apiClient.getFgisData(new ArrayList<>(speByOutNumber.keySet()));
        if (fgisData.isEmpty()) {
            return;
        }
        for (JsonNode data : fgisData) {
            try {
                String outNumber = data.path("miInfo").path("singleMI").path("manufactureNum").asText();
                SPE spe = speByOutNumber.get(outNumber);
                speService.createSpeDocument(spe, new DocumentCreateDTO(), reportService.createSpeFgisReport(data));
                log.info("Установлен документ в {}", spe.getOutNumber());
            } catch (Exception e) {
                throw new ApplicationContextException("Ошибка при инициализации установки документов в SPE", e);
            }
        }
    }

    private void runOnce(String id, Runnable task, Boolean always) {
        if (always || this.checkRunOnce(id)) {
            transactionTemplate.execute(status -> {
                try {
                    log.info("Исполнение скрипта {}", id);
                    task.run();
                    this.markRunOnce(this.em, id, always);
                } catch (Exception e) {
                    log.error("Ошибка при выполнении задачи: {}", id, e);
                    status.setRollbackOnly();
                    throw new RuntimeException("Ошибка при инициализации", e);
                }

                return null;
            });
        }
    }


    private void markRunOnce(EntityManager em, String id, Boolean always) {
        ExecutedRunOnceScripts s = new ExecutedRunOnceScripts();
        s.setName(id + (always ? Instant.now() : ""));
        em.persist(s);
    }

    protected boolean checkRunOnce(String id) {
        return !this.runOnceList.contains(id);
    }

    private void updateRunOnceListCache() {
        this.runOnceList = this.em.createNativeQuery("select e.name from rces_history.executed_run_once_scripts e", String.class).getResultList();
    }
}
