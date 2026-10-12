package com.example.rces.specifications;

import com.example.rces.models.Employee;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class EmployeeSpecifications {

    public static Specification<Employee> filterBy(String query, String role, Boolean active, Long subDivisionId) {
        return (root, criteriaQuery, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (query != null && !query.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("name")), "%" + query.toLowerCase().trim() + "%"));
            }

            if (role != null && !role.isBlank()) {
                predicates.add(cb.equal(root.get("role"), role));
            }

            if (active != null) {
                predicates.add(cb.equal(root.get("isActive"), active));
            }

            if (subDivisionId != null) {
                predicates.add(cb.equal(root.get("subDivision").get("id"), subDivisionId));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
