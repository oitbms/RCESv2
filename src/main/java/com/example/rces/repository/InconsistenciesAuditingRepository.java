package com.example.rces.repository;

import com.example.rces.models.Inconsistency;

public interface InconsistenciesAuditingRepository extends BaseAuditingRepository<Inconsistency, Long> {

    Inconsistency findByName(String name);
}
