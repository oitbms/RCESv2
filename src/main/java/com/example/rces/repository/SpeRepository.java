package com.example.rces.repository;

import com.example.rces.models.SPE;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpeRepository extends JpaRepository<SPE, Integer> {

    @Override
    @EntityGraph(attributePaths = "employee")
    List<SPE> findAll();

}
