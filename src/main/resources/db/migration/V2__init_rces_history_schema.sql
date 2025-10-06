CREATE TABLE IF NOT EXISTS rces_history.revinfo
(
    rev        INT AUTO_INCREMENT PRIMARY KEY,
    revtstmp   BIGINT,
    changed_by BIGINT,
    CONSTRAINT fk_revinfo_employee FOREIGN KEY (changed_by) REFERENCES rces.employees (id)
);

CREATE TABLE IF NOT EXISTS rces_history.employees_history
(
    id        BIGINT  NOT NULL,
    rev       INTEGER NOT NULL,
    revtype   TINYINT,
    name      VARCHAR(100),
    password  VARCHAR(255),
    mlm_node  VARCHAR(50),
    role      VARCHAR(255),
    is_active BOOLEAN,
    chat_id   BIGINT,

    PRIMARY KEY (id, rev),
    FOREIGN KEY (rev) REFERENCES rces_history.revinfo (rev)

);

CREATE TABLE IF NOT EXISTS rces_history.inconsistencies_history
(
    id           BIGINT  NOT NULL,
    rev          INTEGER NOT NULL,
    revtype      TINYINT,
    name         VARCHAR(255),
    control_type VARCHAR(255),

    PRIMARY KEY (id, rev),
    FOREIGN KEY (rev) REFERENCES rces_history.revinfo (rev)
);

CREATE TABLE IF NOT EXISTS rces_history.documents_history
(
    id      VARCHAR(36) NOT NULL,
    rev     INTEGER     NOT NULL,
    revtype TINYINT,
    name    VARCHAR(150),

    PRIMARY KEY (id, rev),
    FOREIGN KEY (rev) REFERENCES rces_history.revinfo (rev)
);

CREATE TABLE IF NOT EXISTS rces_history.plan_spe_history
(
    number             INT     NOT NULL,
    rev                INTEGER NOT NULL,
    revtype            TINYINT,
    name               VARCHAR(255),
    type               VARCHAR(255),
    out_number         VARCHAR(255),
    accuracy_class     VARCHAR(255),
    limit_measurement  VARCHAR(255),
    employee_id        BIGINT,
    mark               VARCHAR(255),
    date_preparation   DATE,
    date_verification  DATE,
    certificate_number VARCHAR(255),
    periodicity        INT,
    document_id        BIGINT,
    status             VARCHAR(50),
    color              VARCHAR(50),

    PRIMARY KEY (number, rev),
    FOREIGN KEY (rev) REFERENCES rces_history.revinfo (rev)
);