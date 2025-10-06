package com.example.rces.repository;

import com.example.rces.models.BaseAuditingEntity;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

@NoRepositoryBean
public interface BaseAuditingRepository<T extends BaseAuditingEntity, ID> extends JpaRepository<T, ID> {

    @Lock(LockModeType.OPTIMISTIC_FORCE_INCREMENT)
    @Override
    Optional<T> findById(ID id);

    @Lock(LockModeType.OPTIMISTIC)
    @Query("select e from #{#entityName} e where e.id = :id")
    Optional<T> findByIdOptimistic(@Param("id") ID id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select e from #{#entityName} e where e.id = :id")
    Optional<T> findByIdForUpdate(@Param("id") ID id);

}
