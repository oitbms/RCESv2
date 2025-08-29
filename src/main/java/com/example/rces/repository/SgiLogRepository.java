package com.example.rces.repository;

import com.example.rces.models.SGI;
import com.example.rces.models.SgiLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SgiLogRepository extends JpaRepository<SgiLog, UUID> {

    List<SgiLog> findAllBySgi(SGI sgi);

}
