package com.example.rces.services;

import com.example.rces.models.CustomerOrder;
import com.example.rces.models.Employee;
import com.example.rces.models.Requests;
import com.example.rces.models.enums.Status;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static com.example.rces.services.ServiceUtil.allowedCreateOrUpdate;

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

    public <T> T findSingleByField(Class<T> entityClass, String fieldName, Object fieldValue) {
        return findByField(entityClass, fieldName, fieldValue).get(0);
    }

    public <T> T findById(Class<T> entityClass, Object id) {
        return entityManager.find(entityClass, id);
    }

    public <T> T save(T entity) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Employee updaterCreaterEmployee = findSingleByField(Employee.class, "name", authentication.getName());
        if (entityManager.contains(entity) && allowedCreateOrUpdate(entity, updaterCreaterEmployee, false)) {
            return entityManager.merge(entity);
        }
        try {
            Object id = entityManager.getEntityManagerFactory().getPersistenceUnitUtil().getIdentifier(entity);
            if (id != null && entityManager.find(entity.getClass(), id) != null && allowedCreateOrUpdate(entity, updaterCreaterEmployee, false)) {
                return entityManager.merge(entity);
            }
        } catch (Exception ignored) {
        }
        allowedCreateOrUpdate(entity, updaterCreaterEmployee, true);
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

    public List<Requests> findByType(String type) {
        List<Requests> requests;
        requests = entityManager.createQuery("SELECT e FROM Requests e WHERE e.typeRequest = :type", Requests.class)
                .setParameter("type",  Requests.Type.valueOf(type))
                .getResultList();
        return requests;
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
}