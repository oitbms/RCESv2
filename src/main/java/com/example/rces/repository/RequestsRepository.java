package com.example.rces.repository;

import com.example.rces.models.Requests;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
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
}
