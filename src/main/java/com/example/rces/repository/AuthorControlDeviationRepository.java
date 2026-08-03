package com.example.rces.repository;

import com.example.rces.models.AuthorControlDeviation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthorControlDeviationRepository extends JpaRepository<AuthorControlDeviation, Long> {
}
