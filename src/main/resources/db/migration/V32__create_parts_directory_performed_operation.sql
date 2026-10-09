CREATE TABLE parts_directory_performed_operation
(
    parts_directory_id BIGINT      NOT NULL,
    operation          VARCHAR(50) NOT NULL,
    CONSTRAINT fk_parts_directory_performed_operation
        FOREIGN KEY (parts_directory_id)
            REFERENCES parts_directory (id)
);
