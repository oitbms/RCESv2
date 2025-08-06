package com.example.rces.spm.services;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import static com.example.rces.services.ServiceUtil.validateNativeQuery;

@Repository
@Transactional(transactionManager = "spmTransactionManager")
public class SPMRepository {
    private final EntityManager entityManager;

    @Autowired
    public SPMRepository(@Qualifier("spmEntityManager") EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public <T> T findById(Class<T> entityClass, Object id) {
        return entityManager.find(entityClass, id);
    }

    public <T> List<T> findAll(Class<T> entityClass) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<T> cq = cb.createQuery(entityClass);
        cq.select(cq.from(entityClass));
        return entityManager.createQuery(cq).getResultList();
    }

    public <T> List<T> findByField(Class<T> entityClass, String fieldName, Object fieldValue) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<T> cq = cb.createQuery(entityClass);
        Root<T> root = cq.from(entityClass);

        if (fieldValue instanceof List<?> || fieldValue.getClass().isArray()) {
            Object[] arrayValues;
            if (fieldValue instanceof List<?>) {
                arrayValues = ((List<?>) fieldValue).toArray();
            } else {
                arrayValues = (Object[]) fieldValue;
            }
            cq.select(root).where(root.get(fieldName).in(arrayValues));
        } else {
            cq.select(root).where(cb.equal(root.get(fieldName), fieldValue));
        }

        return entityManager.createQuery(cq).getResultList();
    }

    public <T> List<T> executeQuery(String query, Class<T> entityClass, Boolean isNative) {
        return executeQuery(query, entityClass, Collections.emptyMap(), isNative);
    }

    public <T> List<T> executeQuery(String query, Class<T> entityClass, String paramName, Object paramValue, Boolean isNative) {
        return executeQuery(query, entityClass, Map.of(paramName, paramValue), isNative);
    }

    public <T> List<T> executeQuery(String query, Class<T> entityClass, Map<String, Object> params, Boolean isNative) {
        if (isNative != null && isNative) {
            validateNativeQuery(query);
        }
        try {
            if (isNative != null && isNative) {
                Query nativeQuery = entityManager.createNativeQuery(query, entityClass);
                params.forEach(nativeQuery::setParameter);
                return (List<T>) nativeQuery.getResultList();
            } else {
                TypedQuery<T> typedQuery = entityManager.createQuery(query, entityClass);
                params.forEach(typedQuery::setParameter);
                return typedQuery.getResultList();
            }
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при выполнении запроса к БД СПМ: " + e.getMessage(), e);
        }
    }
    public <T> T findSingleByField(Class<T> entityClass, String fieldName, Object fieldValue) {
        return findByField(entityClass, fieldName, fieldValue).stream().findFirst().orElse(null);
    }

    public EntityManager getEntityManager() {
        return entityManager;
    }
}
