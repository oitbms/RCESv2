package com.example.rces.repository;

import com.example.rces.dto.EmployeeWorkCalendarDto;
import com.example.rces.models.Employee;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends BaseAuditingRepository<Employee, Long> {

    @EntityGraph(attributePaths = {"subDivision"})
    List<Employee> findAllByRole(String role);

    @EntityGraph(attributePaths = {"subDivision"})
    Employee findByName(String name);

    @Query("SELECT NEW com.example.rces.dto.EmployeeWorkCalendarDto( " +
            "e.id as id, " +
            "COALESCE(e.name, '') as username, " +
            "COALESCE(sd.name, 'Не указан') as subDivisionName, " +
            "us.id as userShiftsId, " +
            "COALESCE(s.name, '') as shiftsName, " +
            "CASE WHEN us.startDate IS NULL THEN ' - ' " +
            "     WHEN us.endDate IS NULL " +
            "     THEN CONCAT('с ', DATE_FORMAT(us.startDate, '%d.%m.%Y'), ' (бессрочно)') " +
            "     ELSE CONCAT('с ', DATE_FORMAT(us.startDate, '%d.%m.%Y'), ' по ', DATE_FORMAT(us.endDate, '%d.%m.%Y')) " +
            "END as workDate, " +
            "CASE WHEN s.startTime IS NULL OR s.endTime IS NULL THEN ' - ' " +
            "     ELSE CONCAT('с ', DATE_FORMAT(s.startTime, '%H:%i'), ' до ', DATE_FORMAT(s.endTime, '%H:%i')) " +
            "END as workTime " +
            ")" +
            "FROM Employee e " +
            "LEFT JOIN e.subDivision sd " +
            "LEFT JOIN UserShifts us ON us.employee = e " +
            "LEFT JOIN us.shifts s " +
            "WHERE e.role =:role " +
            "ORDER BY e.id")
    List<EmployeeWorkCalendarDto> findEmployeeWorkCalendar(@Param("role") String role);
}
