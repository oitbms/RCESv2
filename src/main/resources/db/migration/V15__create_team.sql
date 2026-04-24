CREATE TABLE IF NOT EXISTS rces.team
(
    id   BIGINT PRIMARY KEY AUTO_INCREMENT,
    version           BIGINT    NOT NULL DEFAULT 0,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS rces.team_employee
(
    team_id     BIGINT NOT NULL,
    employee_id BIGINT NOT NULL,

    PRIMARY KEY (team_id, employee_id),
    FOREIGN KEY (team_id) REFERENCES rces.team (id),
    FOREIGN KEY (employee_id) REFERENCES rces.employees (id)
);

ALTER TABLE rces.parts_directory
    ADD COLUMN team_id BIGINT,
    ADD CONSTRAINT fk_parts_directory_team
        FOREIGN KEY (team_id) REFERENCES rces.team (id);
