package com.example.rces.repository;

import com.example.rces.dto.RequestDto;
import com.example.rces.models.Requests;
import com.example.rces.models.enums.Role;
import com.example.rces.models.enums.Status;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RequestsRepository extends BaseAuditingRepository<Requests, UUID> {

    @Override
    @EntityGraph(attributePaths = {"employee", "createdBy", "customerOrder", "subDivision"})
    @NonNull
    List<Requests> findAll();

    @Query(value = "SELECT COALESCE(MAX(requestNumber) + 1, 1) FROM Requests ")
    int findNextRequestNumber();

    @EntityGraph(attributePaths = {"employee", "customerOrder", "subDivision"})
    Requests findByRequestNumber(Integer requestNumber);

    @EntityGraph(attributePaths = {"createdBy", "customerOrder", "employee", "subDivision", "updatedBy"})
    List<Requests> findAllByTypeRequest(Requests.Type type);

    @Override
    @Lock(LockModeType.OPTIMISTIC_FORCE_INCREMENT)
    @EntityGraph(attributePaths = {"employee", "createdBy"})
    @NonNull
    Optional<Requests> findById(@Nullable UUID id);

    @Query("SELECT r FROM Requests as r " +
            "JOIN FETCH r.employee as empl " +
            "WHERE empl.id = :employeeId AND r.status = :status AND empl.role = :role")
    List<Requests> findByEmployeeId(@Param("employeeId") Long employeeId, @Param("status") Status status, @Param("role") String param);

    @Query("SELECT r FROM Requests as r " +
            "JOIN FETCH r.employee as e " +
            "WHERE e.id IN (:ids) AND r.status = :status AND e.role = :role")
    List<Requests> findByEmployeeIds(@Param("ids") List<Long> ids, @Param("status") Status status, @Param("role") String param);
}
