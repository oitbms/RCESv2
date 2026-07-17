package com.example.rces.specifications;

import com.example.rces.models.AuthorControl;
import com.example.rces.models.enums.StatusAuthor;
import com.example.rces.models.enums.TypeAuthor;
import org.springframework.data.jpa.domain.Specification;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;

public class AuthorControlSpecifications {

    public static Specification<AuthorControl> hasFilterNumber(String filterNumber) {
        return (root, query, cb) -> {
            if (filterNumber == null || filterNumber.trim().isEmpty()) {
                return cb.conjunction();
            }
            return cb.like(cb.lower(root.get("customerOrderStrCode")), "%" + filterNumber.toLowerCase() + "%");
        };
    }

    public static Specification<AuthorControl> hasFilterEmployee(String filterEmployee) {
        return (root, query, cb) -> {
            if (filterEmployee == null || filterEmployee.trim().isEmpty()) {
                return cb.conjunction();
            }

            return cb.like(cb.lower(root.get("employee").get("fullName")), "%" + filterEmployee.toLowerCase() + "%");
        };
    }

    public static Specification<AuthorControl> hasFilterOrder(String filterOrder) {
        return (root, query, cb) -> {
            if (filterOrder == null || filterOrder.trim().isEmpty()) {
                return cb.conjunction();
            }
            return cb.like(cb.lower(root.get("customerOrderStrCode")), "%" + filterOrder.toLowerCase() + "%");
        };
    }

    public static Specification<AuthorControl> hasFilterSubDivision(String filterSubDivision) {
        return (root, query, cb) -> {
            if (filterSubDivision == null || filterSubDivision.trim().isEmpty()) {
                return cb.conjunction();
            }
            return cb.like(cb.lower(root.get("subDivision").get("name")), "%" + filterSubDivision.toLowerCase() + "%");
        };
    }

    public static Specification<AuthorControl> hasFilterSubDivisionSite(String filterSubDivisionSite) {
        return (root, query, cb) -> {
            if (filterSubDivisionSite == null || filterSubDivisionSite.trim().isEmpty()) {
                return cb.conjunction();
            }

            return cb.like(cb.lower(root.get("site").get("name")), "%" + filterSubDivisionSite.toLowerCase() + "%");
        };
    }

    public static Specification<AuthorControl> hasFilterStatus(String filterStatus) {
        return (root, query, cb) -> {
            if (filterStatus == null || filterStatus.trim().isEmpty()) {
                return cb.conjunction();
            }

            if ("not-finished".equals(filterStatus)) {
                return cb.or(
                        cb.equal(root.get("statusAuthor"), StatusAuthor.NEW),
                        cb.equal(root.get("statusAuthor"), StatusAuthor.APPROVED),
                        cb.equal(root.get("statusAuthor"), StatusAuthor.AWAITING_FIX),
                        cb.equal(root.get("statusAuthor"), StatusAuthor.NOT_APPROVED),
                        cb.equal(root.get("statusAuthor"), StatusAuthor.PENDING_APPROVAL)
                );
            }

            try {
                StatusAuthor status = StatusAuthor.valueOf(filterStatus);
                return cb.equal(root.get("statusAuthor"), status);
            } catch (IllegalArgumentException e) {
                return cb.conjunction();
            }
        };
    }

    public static Specification<AuthorControl> hasFilterType(String filterType) {
        return (root, query, cb) -> {
            if (filterType == null || filterType.trim().isEmpty()) {
                return cb.conjunction();
            }

            try {
                TypeAuthor type = TypeAuthor.valueOf(filterType);
                return cb.equal(root.get("typeAuthor"), type);
            } catch (IllegalArgumentException e) {
                return cb.conjunction();
            }
        };
    }

    public static Specification<AuthorControl> hasFilterInconsistency(String filterInconsistency) {
        return (root, query, cb) -> {
            if (filterInconsistency == null || filterInconsistency.trim().isEmpty()) {
                return cb.conjunction();
            }

            if ("ЕСТЬ_НЕСООТВЕТСТВИЕ".equals(filterInconsistency)) {
                return cb.isTrue(root.get("inconsistency"));
            } else if ("НЕТ_НЕСООТВЕТСТВИЙ".equals(filterInconsistency)) {
                return cb.isFalse(root.get("inconsistency"));
            }

            return cb.conjunction();
        };
    }

    public static Specification<AuthorControl> hasFilterCreateDateBetween(String from, String to) {
        return (root, query, cb) -> {
            if ((from == null || from.trim().isEmpty()) && (to == null || to.trim().isEmpty())) {
                return cb.conjunction();
            }

            try {
                Instant dateFrom = from != null && !from.isEmpty() ?
                        LocalDate.parse(from).atStartOfDay().toInstant(ZoneOffset.UTC) : null;
                Instant dateTo = to != null && !to.isEmpty() ?
                        LocalDate.parse(to).atTime(23, 59, 59).toInstant(ZoneOffset.UTC) : null;

                if (dateFrom != null && dateTo != null) {
                    return cb.between(root.get("createdDate"), dateFrom, dateTo);
                } else if (dateFrom != null) {
                    return cb.greaterThanOrEqualTo(root.get("createdDate"), dateFrom);
                } else if (dateTo != null) {
                    return cb.lessThanOrEqualTo(root.get("createdDate"), dateTo);
                }
            } catch (Exception e) {

            }

            return cb.conjunction();
        };
    }

    public static Specification<AuthorControl> hasFilterUpdateDateBetween(String from, String to) {
        return (root, query, cb) -> {
            if ((from == null || from.trim().isEmpty()) && (to == null || to.trim().isEmpty())) {
                return cb.conjunction();
            }

            try {
                Instant dateFrom = from != null && !from.isEmpty() ?
                        LocalDate.parse(from).atStartOfDay().toInstant(ZoneOffset.UTC) : null;
                Instant dateTo = to != null && !to.isEmpty() ?
                        LocalDate.parse(to).atTime(23, 59, 59).toInstant(ZoneOffset.UTC) : null;

                if (dateFrom != null && dateTo != null) {
                    return cb.between(root.get("updatedDate"), dateFrom, dateTo);
                } else if (dateFrom != null) {
                    return cb.greaterThanOrEqualTo(root.get("updatedDate"), dateFrom);
                } else if (dateTo != null) {
                    return cb.lessThanOrEqualTo(root.get("updatedDate"), dateTo);
                }
            } catch (Exception e) {

            }

            return cb.conjunction();
        };
    }
}
