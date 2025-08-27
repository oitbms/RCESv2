package com.example.rces.services;

import com.example.rces.models.CustomerOrder;
import com.example.rces.models.Employee;
import com.example.rces.models.FactExecutionSGI;
import com.example.rces.models.SGI;
import com.example.rces.models.enums.MlmNode;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import org.springframework.context.ApplicationContextException;
import org.springframework.data.domain.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.example.rces.utils.ServiceUtil.allowedCreateOrUpdate;

@Repository
@Transactional(transactionManager = "primaryTransactionManager")
public class UniversalRepository {

    @PersistenceContext(unitName = "primary")
    private EntityManager entityManager;

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

    public <T> T findSingleByField(Class<T> entityClass, String fieldName, Object fieldValue) {
        return findByField(entityClass, fieldName, fieldValue).stream().findFirst().orElse(null);
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
        } catch (Exception e) {
            throw new ApplicationContextException("Ошибка при сохранения сущности", e);
        }
        allowedCreateOrUpdate(entity, updaterCreaterEmployee, true);
        entityManager.persist(entity);
        return entity;
    }

    public <T> void delete(T entity) {
        if (entity instanceof FactExecutionSGI factExecutionSGI) {
            entityManager.createNativeQuery(
                            "UPDATE fact_execution_sgi SET sgi_id = NULL WHERE id = :id")
                    .setParameter("id", entityManager.getEntityManagerFactory()
                            .getPersistenceUnitUtil()
                            .getIdentifier(entity))
                    .executeUpdate();
            SGI sgi = factExecutionSGI.getSgi();
            sgi.setColor(SGI.ColorSGI.NONE);
            sgi.setAgreed(false);
            save(sgi);
        }
        entityManager.remove(entity);
        entityManager.flush();
    }

    public <T> Page<T> getPageByEntity(Class<T> entityClass, int page, int pageSize, Sort sort,
                                       String conditions, String graphName, String additionalQuery) {

        Pageable pageable = PageRequest.of(page - 1, pageSize, sort);
        String queryStr = "SELECT e FROM " + entityClass.getSimpleName() + " e " + conditions;
        TypedQuery<T> query = entityManager.createQuery(queryStr, entityClass);
        if (graphName != null) {
            query.setHint("jakarta.persistence.loadgraph", entityManager.getEntityGraph(graphName));
        }
        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());
        List<T> content = query.getResultList();
        if (additionalQuery != null && !additionalQuery.trim().isEmpty()) {
            entityManager.createQuery(additionalQuery, entityClass)
                    .setParameter("parentIds", content.stream().map(s -> ((SGI)s).getId()).collect(Collectors.toList()))
                    .getResultList();
        }

        Long total = entityManager.createQuery(
                        "SELECT COUNT(e) FROM " + entityClass.getSimpleName() + " e " + conditions, Long.class)
                .getSingleResult();
        return new PageImpl<>(content, pageable, total);
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

    public Integer generateRequestNumber(Class<?> entityClass) {
        return (Integer) entityManager
                .createQuery("SELECT coalesce(MAX(e.requestNumber) + 1, 1) FROM " + entityClass.getSimpleName() + " e")
                .getSingleResult();
    }

    public void deletePhoto(UUID photoId) {
        entityManager.createQuery("DELETE FROM Images e WHERE e.id = :photoId")
                .setParameter("photoId", photoId)
                .executeUpdate();
    }

    public Employee saveEmployee(Long id, String username, String mlmNodeName, Boolean status, String role, String mlmNode, String password, Long chatID) {
        Employee employee = id != null ? findById(Employee.class, id) : null;
        if (employee != null) {
            employee.setName(username);
            employee.setMlmNode(MlmNode.valueOf(mlmNodeName));
            employee.setRole(role);
            employee.setActive(status);
            employee.setChatId(chatID != -1 ? chatID : employee.getChatId());
        } else {
            employee = new Employee();
            employee.setName(username);
            employee.setMlmNode(MlmNode.valueOf(mlmNodeName));
            employee.setRole(role);
            employee.setActive(status);
            employee.setMlmNode(MlmNode.valueOf(mlmNode));
            employee.setPassword(password);
            employee.setChatId(chatID != -1 ? chatID : null);
        }
        return save(employee);
    }
}