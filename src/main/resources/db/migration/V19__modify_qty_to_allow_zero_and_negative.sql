ALTER TABLE rces.parts_directory
    DROP CHECK chk_parts_directory_qty_min;

ALTER TABLE rces.parts_directory
    ADD CONSTRAINT chk_parts_directory_qty_min
        CHECK (qty >= 0);