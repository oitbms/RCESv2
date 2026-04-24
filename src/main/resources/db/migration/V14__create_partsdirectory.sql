CREATE TABLE IF NOT EXISTS rces.parts_directory
(
    id                BIGINT(16) PRIMARY KEY AUTO_INCREMENT,
    version           BIGINT    NOT NULL DEFAULT 0,
    customer_order_id BINARY(16),
    employee_id       BIGINT,
    name              VARCHAR(255),
    scheme            VARCHAR(255),
    thickness         VARCHAR(255),
    steel             VARCHAR(255),
    qty               INT       NOT NULL,
    qty_completed     INT       NOT NULL DEFAULT 0,
    measurements      VARCHAR(255),
    program           VARCHAR(255),
    machine           VARCHAR(255),
    status            VARCHAR(50),
    comment           VARCHAR(255),
    ready             BOOLEAN   NOT NULL DEFAULT FALSE,
    color             VARCHAR(50),
    date_completion   DATETIME,
    created_date      TIMESTAMP,
    updated_date      TIMESTAMP NULL,
    created_by        BIGINT    NOT NULL DEFAULT 1,
    updated_by        BIGINT    NULL,


    CONSTRAINT chk_parts_directory_qty_min
        CHECK (qty >= 1),
    CONSTRAINT chk_parts_directory_qty_completed_min
        CHECK (qty_completed >= 0),
    FOREIGN KEY (created_by) REFERENCES rces.employees (id),
    FOREIGN KEY (updated_by) REFERENCES rces.employees (id),
    FOREIGN KEY (employee_id) REFERENCES rces.employees (id),
    FOREIGN KEY (customer_order_id) REFERENCES rces.customerorder (id)
);

CREATE TABLE parts_directory_operation
(
    parts_directory_id BIGINT      NOT NULL,
    operation          VARCHAR(50) NOT NULL,
    CONSTRAINT fk_parts_directory_operation
        FOREIGN KEY (parts_directory_id)
            REFERENCES parts_directory (id)
);
