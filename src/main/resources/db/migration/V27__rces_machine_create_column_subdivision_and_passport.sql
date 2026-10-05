ALTER TABLE rces.rces_machine
    ADD COLUMN passport_id BINARY(16),
    ADD CONSTRAINT fk_machine_passport FOREIGN KEY (passport_id) REFERENCES rces.documents (id);

ALTER TABLE rces.rces_machine
    ADD COLUMN subdivision_id BIGINT,
    ADD CONSTRAINT fk_machine_subdivision FOREIGN KEY (subdivision_id) REFERENCES rces.subdivision (id);