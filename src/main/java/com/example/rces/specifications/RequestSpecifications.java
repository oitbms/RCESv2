package com.example.rces.specifications;

import com.example.rces.models.CustomerOrder;
import com.example.rces.models.Employee;
import com.example.rces.models.Requests;
import com.example.rces.models.SubDivision;
import com.example.rces.models.enums.Item;
import com.example.rces.models.enums.Status;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

public class RequestSpecifications {

    public static Specification<Requests> filterBy(
            String type,
            String requestNumber,
            String createdBy,
            String employee,
            String customerOrder,
            String subDivision,
            String reason_wr,
            String item,
            String status,
            String qtyRejected,
            String createdDate,
            String updatedDate
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.equal(root.get("typeRequest"), Requests.Type.valueOf(type)));

            if (requestNumber != null && !requestNumber.isBlank()) {
                predicates.add(cb.like(cb.toString(root.get("requestNumber")), "%" + requestNumber + "%"));
            }

            if (createdBy != null && !createdBy.isBlank()) {
                Join<Requests, Employee> creatorJoin = root.join("createdBy", JoinType.LEFT);
                predicates.add(cb.like(cb.lower(creatorJoin.get("name")), "%" + createdBy.toLowerCase() + "%"));
            }

            if (employee != null && !employee.isBlank()) {
                Join<Requests, Employee> empJoin = root.join("employee", JoinType.LEFT);
                predicates.add(cb.like(cb.lower(empJoin.get("name")), "%" + employee.toLowerCase() + "%"));
            }

            if (customerOrder != null && !customerOrder.isBlank()) {
                Join<Requests, CustomerOrder> orderJoin = root.join("customerOrder", JoinType.LEFT);
                predicates.add(cb.like(cb.lower(orderJoin.get("name")), "%" + customerOrder.toLowerCase() + "%"));
            }

            if (subDivision != null && !subDivision.isBlank()) {
                Join<Requests, SubDivision> divJoin = root.join("subDivision", JoinType.LEFT);
                predicates.add(cb.like(cb.lower(divJoin.get("name")), "%" + subDivision.toLowerCase() + "%"));
            }

            if (reason_wr != null && !reason_wr.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("reason_wr")), "%" + reason_wr.toLowerCase() + "%"));
            }

            if (item != null && !item.isBlank()) {
                predicates.add(cb.equal(root.get("item"), Item.fromName(item)));
            }

            if (status != null && !status.isBlank()) {
                predicates.add(cb.equal(root.get("status"), Status.valueOf(status)));
            }

            if (qtyRejected != null && !qtyRejected.isBlank()) {
                predicates.add(cb.equal(root.get("qtyRejected"), Integer.parseInt(qtyRejected)));
            }

            if (createdDate != null && !createdDate.isBlank()) {
                LocalDateTime dateTime = LocalDateTime.parse(createdDate);
                Instant start = dateTime.atZone(ZoneId.systemDefault()).toInstant();
                Instant end = dateTime.plusMinutes(1).atZone(ZoneId.systemDefault()).toInstant();
                predicates.add(cb.greaterThanOrEqualTo(root.get("createdDate"), start));
                predicates.add(cb.lessThan(root.get("createdDate"), end));
            }

            if (updatedDate != null && !updatedDate.isBlank()) {
                LocalDateTime dateTime = LocalDateTime.parse(updatedDate);
                Instant start = dateTime.atZone(ZoneId.systemDefault()).toInstant();
                Instant end = dateTime.plusMinutes(1).atZone(ZoneId.systemDefault()).toInstant();
                predicates.add(cb.greaterThanOrEqualTo(root.get("updatedDate"), start));
                predicates.add(cb.lessThan(root.get("updatedDate"), end));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
