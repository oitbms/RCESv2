package com.example.rces.models.base;

import com.example.rces.configuration.BeanUtil;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PrePersist;

import java.time.LocalDateTime;

public class EntityBaseListener {
    @PrePersist
    public void prePersist(EntityBase entity) {
        generateRequestNumber(entity);
        setDataCreated(entity);
    }

    private void generateRequestNumber(EntityBase entity) {
        if (entity.getRequestNumber() != null) return;

        EntityManager entityManager = BeanUtil.getBean(EntityManager.class);
        Class<?> entityClass = entity.getClass();

        Integer maxNumber = (Integer) entityManager
                .createQuery("SELECT MAX(e.requestNumber) FROM " + entityClass.getSimpleName() + " e")
                .getSingleResult();

        entity.setRequestNumber(maxNumber != null ? maxNumber + 1 : 1);
    }

    private void setDataCreated(EntityBase entity) {
        if (entity.getCreateDate() == null) {
            entity.setCreateDate(LocalDateTime.now());
        }
    }
}
