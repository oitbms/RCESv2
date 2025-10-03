CREATE SCHEMA IF NOT EXISTS public;

CREATE SCHEMA IF NOT EXISTS rces_history;

DROP TABLE IF EXISTS public.flyway_schema_history;

CREATE TABLE IF NOT EXISTS public.employees
(
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(100) NOT NULL UNIQUE,
    password     VARCHAR(255) NOT NULL,
    mlm_node     VARCHAR(50)  NOT NULL,
    role         VARCHAR(50)  NOT NULL,
    is_active    BOOLEAN      NOT NULL DEFAULT TRUE,
    chat_id      BIGINT       NOT NULL,
    created_date TIMESTAMP,
    updated_date TIMESTAMP    NULL,
    created_by   BIGINT       NOT NULL DEFAULT 1,
    updated_by   BIGINT       NULL,

    INDEX idx_name (name)
);

CREATE TABLE IF NOT EXISTS public.customerorder
(
    id           BINARY(16) PRIMARY KEY,
    str_code     VARCHAR(100) NOT NULL,
    created_date TIMESTAMP    NULL,
    updated_date TIMESTAMP    NULL,
    created_by   BIGINT       NOT NULL DEFAULT 1,
    updated_by   BIGINT       NULL,

    INDEX idx_name (str_code)
);

