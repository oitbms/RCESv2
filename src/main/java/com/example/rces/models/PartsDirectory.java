package com.example.rces.models;

import com.example.rces.dto.PartsDirectoryCreateDTOFrom1C;
import com.example.rces.models.enums.Color;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "parts_directory", catalog = "rces")
public class PartsDirectory extends BaseAuditingEntity {

    public enum Status {
        NEW("Новый"),
        WORK("В работе"),
        REQUIRED("Требуется"),
        COMPLETE("Готов");

        private final String name;

        Status(String name) {
            this.name = name;
        }

        public String getName() {
            return name;
        }
    }

    public enum Operation {
        thermal, locksmith;

        public static List<Operation> fromString(List<String> values) {
            return values.stream()
                    .filter(Objects::nonNull)
                    .map(String::trim)
                    .map(String::toLowerCase)
                    .map(Operation::valueOf)
                    .distinct()
                    .toList();
        }
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private CustomerOrder customerOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    private Employee employee;

    @Column(name = "name")
    private String name;

    @Column(name = "scheme")
    private String scheme;

    @Column(name = "thickness")
    private String thickness;

    @Column(name = "steel")
    private String steel;

    @NotNull
    @Min(0)
    @Column(name = "qty", nullable = false)
    private Integer qty;

    @NotNull
    @Min(0)
    @Column(name = "qty_completed", nullable = false)
    private Integer qtyCompleted = 0;

    @Column(name = "measurements")
    private String measurements;

    @Column(name = "program")
    private String program;

    @Column(name = "machine")
    private String machine;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(name = "comment")
    private String comment;

    @Column(name = "color")
    @Enumerated(EnumType.STRING)
    private Color color;

    @Column(name = "date_completion")
    private LocalDateTime dateCompletion;

    @Column(name = "ready")
    private Boolean ready = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private Team team;

    @ElementCollection(targetClass = Operation.class)
    @CollectionTable(name = "parts_directory_operation",
            joinColumns = @JoinColumn(name = "parts_directory_id"))
    @Column(name = "operation")
    @Enumerated(EnumType.STRING)
    private List<Operation> operation;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public CustomerOrder getCustomerOrder() {
        return customerOrder;
    }

    public void setCustomerOrder(CustomerOrder customerOrder) {
        this.customerOrder = customerOrder;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getScheme() {
        return scheme;
    }

    public void setScheme(String scheme) {
        this.scheme = scheme;
    }

    public String getThickness() {
        return thickness;
    }

    public void setThickness(String thickness) {
        this.thickness = thickness;
    }

    public String getSteel() {
        return steel;
    }

    public void setSteel(String steel) {
        this.steel = steel;
    }

    public Integer getQty() {
        return qty;
    }

    public void setQty(Integer qty) {
        this.qty = qty;
    }

    public Integer getQtyCompleted() {
        return qtyCompleted;
    }

    public void setQtyCompleted(Integer qtyCompleted) {
        this.qtyCompleted = qtyCompleted;
    }

    public String getMeasurements() {
        return measurements;
    }

    public void setMeasurements(String measurements) {
        this.measurements = measurements;
    }

    public String getProgram() {
        return program;
    }

    public void setProgram(String program) {
        this.program = program;
    }

    public String getMachine() {
        return machine;
    }

    public void setMachine(String machine) {
        this.machine = machine;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Color getColor() {
        return color;
    }

    public void setColor(Color color) {
        this.color = color;
    }

    public LocalDateTime getDateCompletion() {
        return dateCompletion;
    }

    public void setDateCompletion(LocalDateTime dateCompletion) {
        this.dateCompletion = dateCompletion;
    }

    public Boolean getReady() {
        return ready;
    }

    public void setReady(Boolean ready) {
        this.ready = ready;
    }

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }


    public List<Operation> getOperation() {
        return operation;
    }

    public void setOperation(List<Operation> operation) {
        this.operation = operation;
    }

    public PartsDirectory() {

    }

    public PartsDirectory(PartsDirectoryCreateDTOFrom1C dto, Employee currentUser) {
        this.employee = currentUser;
        this.scheme = dto.getScheme();
        this.name = dto.getName();
        this.qty = dto.getQty();
        this.steel = dto.getSteel();
        this.measurements = dto.getMeasurements();
        this.status = Status.NEW;
        this.color = Color.NONE;
    }
}
