package com.example.rces.services;

import com.example.rces.models.CustomerOrder;
import com.example.rces.models.Employee;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public class UniversalRepository {
    private final EntityManager entityManager;

    public UniversalRepository(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public <T> List<T> findByField(Class<T> entityClass, String fieldName, Object fieldValue) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<T> cq = cb.createQuery(entityClass);
        Root<T> root = cq.from(entityClass);
        if (fieldValue instanceof List<?>) {
            List<?> values = (List<?>) fieldValue;
            cq.select(root).where(root.get(fieldName).in(values));
        } else {
            cq.select(root).where(cb.equal(root.get(fieldName), fieldValue));
        }
        return entityManager.createQuery(cq).getResultList();
    }

    public <T> T findByName(Class<T> entityClass, String name) {
        String className = entityClass.getSimpleName();

        TypedQuery<T> query = entityManager.createQuery("SELECT e FROM " + className + " e WHERE e.name = :name", entityClass);
        query.setParameter("name", name);

        List<T> results = query.getResultList();
        return results.isEmpty() ? null : results.get(0);
    }


    public <T> T findById(Class<T> entityClass, Object id) {
        return entityManager.find(entityClass, id);
    }

    public <T> T save(T entity) {
        if (entityManager.contains(entity)) {
            return entityManager.merge(entity);
        }
        try {
            Object id = entityManager.getEntityManagerFactory().getPersistenceUnitUtil().getIdentifier(entity);
            if (id != null && entityManager.find(entity.getClass(), id) != null) {
                return entityManager.merge(entity);
            }
        } catch (Exception ignored) {
        }
        entityManager.persist(entity);
        return entity;
    }

    public <T> void delete(T entity) {
        entityManager.remove(entity);
    }

    public <T> List<T> findAll(Class<T> entityClass) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<T> cq = cb.createQuery(entityClass);
        cq.select(cq.from(entityClass));
        return entityManager.createQuery(cq).getResultList();
    }

    public <T> T findByRequestNumber(Class<T> entityClass, Object requestNumber) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<T> cq = cb.createQuery(entityClass);
        Root<T> root = cq.from(entityClass);
        cq.select(root).where(cb.equal(root.get("requestNumber"), requestNumber));
        return entityManager.createQuery(cq).getSingleResult();
    }

    public CustomerOrder createCustomerOrder(Employee employee, String customerOrderName) {
        CustomerOrder customerOrder = new CustomerOrder();
        customerOrder.setCreateDate(LocalDateTime.now());
        customerOrder.setEmployee(employee);
        customerOrder.setName(customerOrderName);
        return save(customerOrder);
    }

    public Integer generateRequestNumber() {
        return (Integer) entityManager
                .createQuery("SELECT coalesce(MAX(e.requestNumber) + 1, 1) FROM Requests e")
                .getSingleResult();
    }

    public Employee findEmployeeByChatId(Long chatId) {
        return entityManager.createQuery("SELECT e FROM Employee e WHERE e.chatId = :chatId", Employee.class)
                .setParameter("chatId", chatId)
                .getSingleResult();
    }
}