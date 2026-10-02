package com.example.rces.repository;

import com.example.rces.models.Machine;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface MachineRepository extends JpaRepository<Machine, Long> {

    @EntityGraph(attributePaths = {"document","passport","otherDocument"})
    Machine findByNumber(Integer number);

    boolean existsByNumber(Integer number);

    @Query("""
            select count(f) > 0 from DocumentFile f
            where f.id = :fileId
              and exists (select m from Machine m
                          where m.document = f.document
                             or m.passport = f.document
                             or m.otherDocument = f.document)
            """)
    boolean existsMachineFile(@Param("fileId") UUID fileId);

}
