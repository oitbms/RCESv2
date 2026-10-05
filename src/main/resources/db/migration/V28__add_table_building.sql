CREATE TABLE building
(
    id             BIGINT(16) PRIMARY KEY AUTO_INCREMENT,
    item_number    INT       NOT NULL UNIQUE,
    subdivision_id BIGINT    NOT NULL,
    document_id    BINARY(16),
    version        BIGINT    NOT NULL DEFAULT 0,
    created_date   TIMESTAMP          DEFAULT CURRENT_TIMESTAMP,
    updated_date   TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    created_by     BIGINT    NOT NULL DEFAULT 1,
    updated_by     BIGINT    NULL,

    FOREIGN KEY (subdivision_id) REFERENCES rces.subdivision (id),
    FOREIGN KEY (created_by) REFERENCES rces.employees (id),
    FOREIGN KEY (updated_by) REFERENCES rces.employees (id),
    FOREIGN KEY (document_id) REFERENCES rces.documents (id)
);