CREATE TABLE shifts
(
    id         BIGINT PRIMARY KEY,
    name       VARCHAR(50) NOT NULL,
    start_time TIME        NOT NULL,
    end_time   TIME        NOT NULL
);

CREATE TABLE user_shifts
(
    id          BIGINT PRIMARY KEY,
    employee_id BIGINT  NOT NULL REFERENCES rces.employees(id) ON DELETE CASCADE,
    shifts_id   BIGINT  NOT NULL REFERENCES shifts(id),
    start_date  DATE NOT NULL,
    end_date    DATE ,
    created_by  BIGINT REFERENCES rces.employees(id),
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
)