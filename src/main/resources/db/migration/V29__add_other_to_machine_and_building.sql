ALTER TABLE rces.rces_machine
    ADD COLUMN other_text TEXT NULL,
    ADD COLUMN other_document_id BINARY(16) NULL,
    ADD CONSTRAINT fk_machine_other_document FOREIGN KEY (other_document_id) REFERENCES rces.documents (id);

ALTER TABLE rces.building
    ADD COLUMN other_text TEXT NULL,
    ADD COLUMN other_document_id BINARY(16) NULL,
    ADD CONSTRAINT fk_building_other_document FOREIGN KEY (other_document_id) REFERENCES rces.documents (id);
