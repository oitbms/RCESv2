package com.example.rces.repository;

import com.example.rces.models.Inconsistency;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InconsistenciesRepository extends JpaRepository<Inconsistency, Long> {

    Inconsistency findByName(String name);
}
