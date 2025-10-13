package com.example.rces.service.impl;

import com.example.rces.dto.RequestHistoryDTO;
import com.example.rces.models.BaseRevisionEntity;
import com.example.rces.models.Requests;
import com.example.rces.service.RequestHistoryService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.hibernate.envers.AuditReader;
import org.hibernate.envers.AuditReaderFactory;
import org.hibernate.envers.RevisionType;
import org.hibernate.envers.query.AuditEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.ZoneId;
import java.util.*;

@Service
@Transactional
public class RequestHistoryServiceImpl implements RequestHistoryService {

    @PersistenceContext
    private EntityManager em;

    private AuditReader getAuditReader() {
        return AuditReaderFactory.get(em);
    }

    public List<RequestHistoryDTO> getDetailedRequestHistory(UUID requestId) {
        AuditReader reader = getAuditReader();

        try {
            @SuppressWarnings("unchecked")
            List<Object[]> revisions = reader.createQuery()
                    .forRevisionsOfEntity(Requests.class, false, true)
                    .add(AuditEntity.id().eq(requestId))
                    .addOrder(AuditEntity.revisionNumber().asc())
                    .getResultList();

            List<RequestHistoryDTO> history = new ArrayList<>();

            for (Object[] revisionData : revisions) {
                BaseRevisionEntity revisionEntity = (BaseRevisionEntity) revisionData[1];

                Set<String> inconsistencies = getInconsistenciesForRevisionNative(requestId, revisionEntity.getRev());

                RequestHistoryDTO dto = mapToRequestHistoryDTO(revisionData);

                dto.getRequestData().setInconsistencies(inconsistencies);

                history.add(dto);
            }

            return history;

        } catch (Exception e) {
            throw new RuntimeException("Ошибка при получении истории заявки: " + e.getMessage(), e);
        }
    }

    private RequestHistoryDTO mapToRequestHistoryDTO(Object[] revisionData) {
        Requests request = (Requests) revisionData[0];
        BaseRevisionEntity revisionEntity = (BaseRevisionEntity) revisionData[1];
        RevisionType revisionType = (RevisionType) revisionData[2];

        RequestHistoryDTO dto = new RequestHistoryDTO();
        dto.setRequestId(request.getId());
        dto.setRequestData(RequestHistoryDTO.RequestHistoryData.from(request));
        dto.setRevisionNumber(revisionEntity.getRev());
        dto.setRevisionDate(Instant.ofEpochMilli(revisionEntity.getRevtstmp())
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime());
        dto.setRevisionType(revisionType.name());
        dto.setChangedBy(revisionEntity.getChangedBy().getName());

        return dto;
    }

    private Set<String> getInconsistenciesForRevisionNative(UUID requestId, Long revisionNumber) {
        try {
            String hexUuid = requestId.toString().replace("-", "");

            String sql = "SELECT i.name " +
                    "FROM rces_history.request_incosistencies_history ria " +
                    "JOIN rces.inconsistencies i ON ria.incosistency_id = i.id " +
                    "WHERE ria.request_id = UNHEX(:hexUuid) " +
                    "AND ria.REV = :rev " +
                    "AND ria.REVTYPE != 2";

            @SuppressWarnings("unchecked")
            List<String> names = em.createNativeQuery(sql)
                    .setParameter("hexUuid", hexUuid)
                    .setParameter("rev", revisionNumber)
                    .getResultList();

            return new HashSet<>(names);

        } catch (Exception e) {
            System.err.println("Ошибка при получении несоответствий: " + e.getMessage());
            return Collections.emptySet();
        }
    }
}
