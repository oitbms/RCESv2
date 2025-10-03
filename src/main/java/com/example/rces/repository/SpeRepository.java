package com.example.rces.repository;

import com.example.rces.models.SPE;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SpeRepository extends JpaRepository<SPE, Integer> {
}
