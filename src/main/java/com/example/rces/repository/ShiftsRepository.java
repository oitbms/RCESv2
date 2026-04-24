package com.example.rces.repository;

import com.example.rces.models.Shifts;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShiftsRepository extends JpaRepository<Shifts, Long> {

    Boolean existsByName(String name);

}
