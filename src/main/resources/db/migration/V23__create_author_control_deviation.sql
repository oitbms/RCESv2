CREATE TABLE IF NOT EXISTS authorcontrol_deviation
(
    id                BIGINT PRIMARY KEY AUTO_INCREMENT,
    item_name         VARCHAR(512) NOT NULL,
    inconsistency     VARCHAR(512) NOT NULL,
    subdivision_id    BIGINT       NOT NULL,
    period_removal    DATE,
    date_removal      DATE,
    author_control_id BIGINT       NOT NULL,
    success           BOOLEAN      NOT NULL,
    created_date      TIMESTAMP             DEFAULT CURRENT_TIMESTAMP,
    updated_date      TIMESTAMP    NULL ON UPDATE CURRENT_TIMESTAMP,
    created_by        BIGINT       NOT NULL DEFAULT 1,
    updated_by        BIGINT       NULL,
    comment           VARCHAR(512),
    number            INT,
    version           BIGINT       NOT NULL DEFAULT 0,

    FOREIGN KEY (subdivision_id) REFERENCES rces.subdivision (id),
    FOREIGN KEY (created_by) REFERENCES rces.employees (id),
    FOREIGN KEY (updated_by) REFERENCES rces.employees (id)
);

-- ALTER TABLE images
--     ADD COLUMN IF NOT EXISTS authorcontrol_deviation_id BIGINT NULL;
ALTER TABLE images
    ADD CONSTRAINT fk_images_authorcontrol_deviation_id
        FOREIGN KEY (authorcontrol_deviation_id)
            REFERENCES authorcontrol_deviation (id)
            ON DELETE CASCADE;

-- ALTER TABLE images
--     ADD COLUMN IF NOT EXISTS authorcontrol_deviation_correction_id BIGINT NULL;
ALTER TABLE images
    ADD CONSTRAINT fk_images_authorcontrol_deviation_correction_id
        FOREIGN KEY (authorcontrol_deviation_correction_id)
            REFERENCES authorcontrol_deviation (id)
            ON DELETE CASCADE;
