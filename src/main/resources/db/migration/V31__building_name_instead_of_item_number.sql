ALTER TABLE rces.building
    ADD COLUMN name VARCHAR(255) NULL AFTER id;

ALTER TABLE rces.building
    MODIFY COLUMN name VARCHAR (255) NOT NULL;

ALTER TABLE rces.building
    DROP COLUMN item_number;
