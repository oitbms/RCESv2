package com.example.rces.specifications;

import com.example.rces.models.*;
import com.example.rces.models.enums.Status;
import com.example.rces.models.enums.StatusAuthor;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class AuthorControlSpecifications {

    public static Specification<AuthorControl> filterBy(
            String filterNumber,
            String filterEmployee,
            String filterOrder,
            String filterSubDivision,
            String filterSubDivisionSite,
            String filterStatus,
            String filterCreateDateFrom,
            String filterCreateDateTo,
            String filterUpdateDateFrom,
            String filterUpdateDateTo
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filterNumber != null && !filterNumber.isBlank()) {
                predicates.add(cb.equal((root.get("id")),filterNumber));
            }

            if (filterEmployee != null && !filterEmployee.isBlank()) {
                Join<Requests, Employee> creatorJoin = root.join("employee", JoinType.LEFT);
                predicates.add(cb.like(cb.lower(creatorJoin.get("name")), "%" + filterEmployee.toLowerCase() + "%"));
            }

            if (filterOrder != null && !filterOrder.isBlank()) {
                predicates.add(cb.like(cb.toString(root.get("customerOrderStrCode")), "%" + filterOrder + "%"));
            }

            if (filterSubDivision != null && !filterSubDivision.isBlank()) {
                Join<AuthorControl, SubDivision> divJoin = root.join("subDivision", JoinType.LEFT);
                predicates.add(cb.like(cb.lower(divJoin.get("name")), "%" + filterSubDivision.toLowerCase() + "%"));
            }

            if (filterSubDivisionSite != null && !filterSubDivisionSite.isBlank()) {
                Join<AuthorControl, Site> divJoin = root.join("site", JoinType.LEFT);
                predicates.add(cb.equal(cb.lower(divJoin.get("name")),filterSubDivisionSite));
            }

            if (filterStatus != null && !filterStatus.isBlank()) {
                predicates.add(cb.equal(root.get("statusAuthor"), StatusAuthor.valueOf(filterStatus)));
            }

            if (filterCreateDateFrom != null && !filterCreateDateFrom.isBlank()) {
                LocalDate fromDate = LocalDate.parse(filterCreateDateFrom);
                predicates.add(cb.greaterThanOrEqualTo(root.get("createdDate"), fromDate.atStartOfDay()));
            }

            if (filterCreateDateTo != null && !filterCreateDateTo.isBlank()) {
                LocalDate toDate = LocalDate.parse(filterCreateDateTo);
                predicates.add(cb.lessThanOrEqualTo(root.get("createdDate"), toDate.atTime(23, 59, 59)));
            }

            if (filterUpdateDateFrom != null && !filterUpdateDateFrom.isBlank()) {
                LocalDate fromDate = LocalDate.parse(filterUpdateDateFrom);
                predicates.add(cb.greaterThanOrEqualTo(root.get("updatedDate"), fromDate.atStartOfDay()));
            }

            if (filterUpdateDateTo != null && !filterUpdateDateTo.isBlank()) {
                LocalDate toDate = LocalDate.parse(filterUpdateDateTo);
                predicates.add(cb.lessThanOrEqualTo(root.get("updatedDate"), toDate.atTime(23, 59, 59)));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
