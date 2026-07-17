CREATE TABLE site
(
    id   BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS author_control
(
    id             BIGINT PRIMARY KEY AUTO_INCREMENT,
    site_id        BIGINT       NOT NULL,
    inconsistency  BOOLEAN      NOT NULL DEFAULT TRUE,
    str_code       VARCHAR(144) NOT NULL,
    site_code      VARCHAR(144),
    subdivision_id BIGINT       NOT NULL,
    employee_id    BIGINT       NOT NULL,
    status_author  VARCHAR(20)  NOT NULL,
    type_author    VARCHAR(20)  NOT NULL,
    version        BIGINT       NOT NULL DEFAULT 0,
    created_date   TIMESTAMP             DEFAULT CURRENT_TIMESTAMP,
    updated_date   TIMESTAMP    NULL ON UPDATE CURRENT_TIMESTAMP,
    created_by     BIGINT       NOT NULL DEFAULT 1,
    updated_by     BIGINT       NULL,

    FOREIGN KEY (site_id) REFERENCES rces.site (id),
    FOREIGN KEY (subdivision_id) REFERENCES rces.subdivision (id),
    FOREIGN KEY (created_by) REFERENCES rces.employees (id),
    FOREIGN KEY (updated_by) REFERENCES rces.employees (id),
    FOREIGN KEY (employee_id) REFERENCES rces.employees (id),

    CONSTRAINT status_author_check CHECK (status_author IN
                                          ('NEW', 'PENDING_APPROVAL', 'AWAITING_FIX', 'NOT_APPROVED', 'APPROVED')),

    CONSTRAINT type_author_check CHECK (type_author IN ('PLANNED', 'UNPLANNED'))
);