CREATE TABLE IF NOT EXISTS rces.employees
(
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(100) NOT NULL UNIQUE,
    password     VARCHAR(255) NOT NULL,
    mlm_node     VARCHAR(50)  NOT NULL,
    role         VARCHAR(50)  NOT NULL,
    is_active    BOOLEAN      NOT NULL DEFAULT TRUE,
    chat_id      BIGINT       NOT NULL,
    version      BIGINT                DEFAULT 1 NOT NULL,
    created_date TIMESTAMP,
    updated_date TIMESTAMP    NULL,
    created_by   BIGINT       NOT NULL DEFAULT 1,
    updated_by   BIGINT       NULL,

    INDEX idx_name (name)
);

CREATE TABLE IF NOT EXISTS rces.customerorder
(
    id           BINARY(16) PRIMARY KEY,
    str_code     VARCHAR(100) NOT NULL,
    version      BIGINT                DEFAULT 1 NOT NULL,
    created_date TIMESTAMP    NULL,
    updated_date TIMESTAMP    NULL,
    created_by   BIGINT       NOT NULL DEFAULT 1,
    updated_by   BIGINT       NULL,

    INDEX idx_name (str_code)
);

CREATE TABLE IF NOT EXISTS rces.documents
(
    id           BINARY(16) PRIMARY KEY,
    name         VARCHAR(150) NOT NULL UNIQUE,
    version      BIGINT                DEFAULT 1 NOT NULL,
    created_date TIMESTAMP    NULL,
    updated_date TIMESTAMP    NULL,
    created_by   BIGINT       NOT NULL DEFAULT 1,
    updated_by   BIGINT       NULL,

    INDEX idx_name (name)
);

CREATE TABLE IF NOT EXISTS rces.images
(
    id          BINARY(16) PRIMARY KEY,
    name        VARCHAR(255),
    data        LONGBLOB,
    request_id  VARCHAR(36),
    sgi_id      VARCHAR(36),
    sgim_id     VARCHAR(36),
    document_id VARCHAR(36),

    FOREIGN KEY (request_id) REFERENCES rces.requests (id),
    FOREIGN KEY (sgi_id) REFERENCES rces.fact_execution_sgi (id),
    FOREIGN KEY (sgim_id) REFERENCES rces.plan_sgi (id),
    FOREIGN KEY (document_id) REFERENCES rces.documents (id)
);

CREATE TABLE IF NOT EXISTS rces.requests
(
    id                       BINARY(16) PRIMARY KEY,
    version                  INT         NOT NULL DEFAULT 0,
    type_request             VARCHAR(50) NOT NULL,
    work_date                DATETIME,
    created_by               BIGINT,
    updated_by               BIGINT,
    created_at               DATETIME,
    update_at                DATETIME,
    request_number           INT,
    employee_id              BIGINT,
    customer_order_id        BIGINT,
    reason                   VARCHAR(50),
    qty                      INT,
    mlm_node                 VARCHAR(50),
    item                     VARCHAR(50),
    status_id                VARCHAR(50),
    comment                  TEXT,
    reason_wr                VARCHAR(255),
    description              TEXT,
    closed_date              DATETIME,
    closed_employee          BIGINT,
    chat_id                  BIGINT,
    message_id               INT,
    score                    VARCHAR(50),
    control                  VARCHAR(255),
    comment_agreed           TEXT,
    title                    VARCHAR(255),
    qty_rejected             INT                  DEFAULT 0,
    frozen                   BOOLEAN              DEFAULT FALSE,
    created_by_audit         VARCHAR(255),
    created_date_audit       TIMESTAMP,
    last_modified_by_audit   VARCHAR(255),
    last_modified_date_audit TIMESTAMP,

    FOREIGN KEY (created_by) REFERENCES rces.employees (id),
    FOREIGN KEY (updated_by) REFERENCES rces.employees (id),
    FOREIGN KEY (employee_id) REFERENCES rces.employees (id),
    FOREIGN KEY (closed_employee) REFERENCES rces.employees (id),
    FOREIGN KEY (customer_order_id) REFERENCES rces.customerorder (id)
);

CREATE TABLE IF NOT EXISTS rces.inconsistencies
(
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(255) NOT NULL,
    control_type VARCHAR(255) NOT NULL,
    version      BIGINT                DEFAULT 1 NOT NULL,
    created_date TIMESTAMP    NULL,
    updated_date TIMESTAMP    NULL,
    created_by   BIGINT       NOT NULL DEFAULT 1,
    updated_by   BIGINT       NULL
);

CREATE TABLE IF NOT EXISTS rces.plan_sgi
(
    id            BINARY(16) PRIMARY KEY,
    created_at    DATE,
    number        INT,
    workshop      VARCHAR(255),
    event         VARCHAR(255),
    actions       VARCHAR(499),
    department    VARCHAR(50),
    employee_id   BIGINT,
    parent_sgi_id VARCHAR(36),
    desired_date  DATE,
    plan_date     DATE,
    executions_id VARCHAR(36),
    color         VARCHAR(50),
    note          VARCHAR(1000),
    comment       VARCHAR(1000),
    agreed        BOOLEAN,

    FOREIGN KEY (employee_id) REFERENCES rces.employees (id),
    FOREIGN KEY (parent_sgi_id) REFERENCES rces.plan_sgi (id),
    FOREIGN KEY (executions_id) REFERENCES rces.fact_execution_sgi (id)
);

CREATE TABLE IF NOT EXISTS rces.fact_execution_sgi
(
    id             BINARY(16) PRIMARY KEY,
    sgi_id         VARCHAR(36) UNIQUE,
    execution_date DATE,
    report         VARCHAR(1000),

    FOREIGN KEY (sgi_id) REFERENCES plan_sgi (id)
);

CREATE TABLE IF NOT EXISTS rces.plan_spe
(
    number             INT AUTO_INCREMENT PRIMARY KEY,
    name               VARCHAR(255) NOT NULL,
    type               VARCHAR(255) NOT NULL,
    out_number         VARCHAR(255) NOT NULL,
    accuracy_class     VARCHAR(255),
    limit_measurement  VARCHAR(255),
    subdivision        VARCHAR(255) NOT NULL,
    employee_id        BIGINT,
    mark               VARCHAR(255),
    date_preparation   DATE,
    date_verification  DATE,
    certificate_number VARCHAR(255),
    periodicity        INT          NOT NULL,
    document_id        BIGINT,
    status             VARCHAR(50)           DEFAULT 'NONE',
    color              VARCHAR(50)           DEFAULT 'NONE',
    version            BIGINT                DEFAULT 1 NOT NULL,
    created_date       TIMESTAMP    NULL,
    updated_date       TIMESTAMP    NULL,
    created_by         BIGINT       NOT NULL DEFAULT 1,
    updated_by         BIGINT       NULL,

    FOREIGN KEY (employee_id) REFERENCES rces.employees (id),
    FOREIGN KEY (document_id) REFERENCES rces.documents (id),

    INDEX idx_name (name)
);