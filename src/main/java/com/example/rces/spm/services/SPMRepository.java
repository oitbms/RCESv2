package com.example.rces.spm.services;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional(transactionManager = "spmTransactionManager")
public class SPMRepository {
    private final EntityManager entityManager;
    public final EntityManagerFactory entityManagerFactory;

    @Autowired
    public SPMRepository(@Qualifier("spmEntityManager") EntityManager entityManager) {
        this.entityManager = entityManager;
        this.entityManagerFactory = entityManager.getEntityManagerFactory();
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

    //findByField(User.class, "name", "Ivan", "!age", "createdAt"); !age будет desc
    public <T> List<T> findByField(Class<T> entityClass, String fieldName, Object fieldValue, String... orderBy) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<T> cq = cb.createQuery(entityClass);
        Root<T> root = cq.from(entityClass);

        if (fieldValue instanceof List) {
            cq.where(root.get(fieldName).in((List<?>) fieldValue));
        } else if (fieldValue.getClass().isArray()) {
            cq.where(root.get(fieldName).in((Object[]) fieldValue));
        } else {
            cq.where(cb.equal(root.get(fieldName), fieldValue));
        }
        if (orderBy != null) {
            for (String field : orderBy) {
                if (field == null || field.isEmpty()) continue;
                boolean desc = field.startsWith("!");
                String realField = desc ? field.substring(1) : field;
                try {
                    if (desc) {
                        cq.orderBy(cb.desc(root.get(realField)));
                    } else {
                        cq.orderBy(cb.asc(root.get(realField)));
                    }
                } catch (IllegalArgumentException ignored) {
                }
            }
        }

        return entityManager.createQuery(cq).getResultList();
    }

    public <T> T findSingleByField(Class<T> entityClass, String fieldName, Object fieldValue) {
        return findByField(entityClass, fieldName, fieldValue, null).stream().findFirst().orElse(null);
    }

    public EntityManager getEntityManager() {
        return entityManager;
    }
}
