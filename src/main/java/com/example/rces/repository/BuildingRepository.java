package com.example.rces.repository;

import com.example.rces.models.Building;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BuildingRepository extends JpaRepository<Building, Long> {

    @EntityGraph(attributePaths = {"subdivision"})
    List<Building> findAll();

    @EntityGraph(attributePaths = {"document","otherDocument"})
    Optional<Building> findById(Long id);

    @Query("""
            select count(f) > 0 from DocumentFile f
            where f.id = :fileId
              and exists (select b from Building b
                          where b.document = f.document
                             or b.otherDocument = f.document)
            """)
    boolean existsBuildingFile(@Param("fileId") UUID fileId);

    @Query("""
            select count(i) > 0 from Images i
            where i.id = :imageId
              and exists (select b from Building b where b.document = i.document)
            """)
    boolean existsBuildingPhoto(@Param("imageId") UUID imageId);

}
