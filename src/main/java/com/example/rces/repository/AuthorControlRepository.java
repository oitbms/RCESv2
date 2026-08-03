package com.example.rces.repository;

import com.example.rces.models.AuthorControl;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthorControlRepository extends JpaRepository<AuthorControl, Long>, JpaSpecificationExecutor<AuthorControl> {

    @Override
    @EntityGraph(attributePaths = {"site","customerOrderStrCode","employee","subDivision","authorControlDeviations"})
    Page<AuthorControl> findAll(Specification<AuthorControl> spec, Pageable pageable);

}
