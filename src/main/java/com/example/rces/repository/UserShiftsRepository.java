package com.example.rces.repository;

import com.example.rces.models.UserShifts;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserShiftsRepository extends JpaRepository<UserShifts, Long> {

    @EntityGraph(attributePaths = {"employee", "shifts"})
    Boolean existsByEmployee_IdAndShifts_Id(long employeeId, long shiftId);

    @EntityGraph(attributePaths = {"employee"})
    UserShifts findByEmployee_Id(long employeeId);
}
