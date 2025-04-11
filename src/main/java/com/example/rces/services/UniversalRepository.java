package com.example.rces.services;

import com.example.rces.models.CustomerOrder;
import com.example.rces.models.Employee;
import com.example.rces.models.Requests;
import com.example.rces.models.enums.Status;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
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

    public CustomerOrder createOrGetCustomerOrder(ObjectMapper objectMapper, Employee employee, String customerOrderName, String customerOrderJson) {
        try {
            CustomerOrder existingOrder = null;
            if (!customerOrderName.isBlank()) {
                List<CustomerOrder> orders = findByField(CustomerOrder.class, "name", customerOrderName);
                if (!orders.isEmpty()) {
                    existingOrder = orders.get(0);
                }
            }
            CustomerOrder jsonOrder = null;
            if (customerOrderJson != null && !customerOrderJson.isBlank()) {
                jsonOrder = objectMapper.readValue(customerOrderJson, CustomerOrder.class);
            }
            if (existingOrder != null && jsonOrder != null) {
                if (existingOrder.getName().equals(jsonOrder.getName())) {
                    return jsonOrder;
                }
            } else if (existingOrder != null) {
                return existingOrder;
            } else {
                CustomerOrder newOrder = new CustomerOrder();
                newOrder.setCreateDate(LocalDateTime.now());
                newOrder.setEmployee(employee);
                newOrder.setName(customerOrderName);
                return save(newOrder);
            }
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to parse customer order JSON", e);
        }
        return null;
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

    public List<Requests> getRequestsByType(String type, int page, int pageSize) {
        Requests.Type requestType = Requests.Type.valueOf(type.toLowerCase());
        return entityManager.createQuery("SELECT e from Requests e WHERE e.typeRequest = :type ORDER BY e.requestNumber", Requests.class)
                .setParameter("type", requestType)
                .setFirstResult(page * pageSize)
                .setMaxResults(pageSize)
                .getResultList();
    }

    public List<Requests> getRequestsByStatus(String status, String type, int page, int pageSize) {
        Requests.Type requestType = Requests.Type.valueOf(type.toLowerCase());
        Status requestStatus = Status.valueOf(status.toUpperCase()); // Изменено на toUpperCase(), чтобы избежать ошибок
        return entityManager.createQuery("SELECT e FROM Requests e WHERE e.typeRequest = :type AND e.status = :status ORDER BY e.requestNumber", Requests.class)
                .setParameter("type", requestType)
                .setParameter("status", requestStatus)
                .setFirstResult(page * pageSize)
                .setMaxResults(pageSize)
                .getResultList();
    }

    public int getTotalRequestsCount(String type) {
        Requests.Type requestType = Requests.Type.valueOf(type.toLowerCase());
        Long count = entityManager.createQuery("SELECT COUNT(e) FROM Requests e WHERE e.typeRequest = :type", Long.class)
                .setParameter("type", requestType)
                .getSingleResult();
        return count.intValue();
    }

    public int getTotalRequestsCountByStatus(String type, String status) {
        Requests.Type requestType = Requests.Type.valueOf(type.toLowerCase());
        Status requestStatus = Status.valueOf(status);
        Long count = entityManager.createQuery("SELECT COUNT(e) from Requests e WHERE e.typeRequest =:type and e.status =:status", Long.class)
                .setParameter("type",requestType)
                .setParameter("status",requestStatus)
                .getSingleResult();
        return count.intValue();
    }
}