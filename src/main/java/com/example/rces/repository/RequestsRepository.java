package com.example.rces.repository;

import com.example.rces.models.Requests;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RequestsRepository extends JpaRepository<Requests, UUID> {

    @Override
    @EntityGraph("employee, createdBy")
    @NonNull
    List<Requests> findAll();

    @Query(value = "SELECT COALESCE(MAX(requestNumber) + 1, 1) FROM Requests ")
    int findNextRequestNumber();

    Requests findByRequestNumber(Integer requestNumber);

    List<Requests> findAllByTypeRequest(Requests.Type type);

    @Override
    @EntityGraph(attributePaths = {"employee"})
    @NonNull
    Optional<Requests> findById(UUID id);
}
