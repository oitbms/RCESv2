ALTER TABLE rces.requests
    ADD COLUMN document_id BINARY(16) NULL,
    ADD CONSTRAINT fk_requests_document FOREIGN KEY (document_id) REFERENCES rces.documents (id);

ALTER TABLE rces_history.requests_history
    ADD COLUMN document_id BINARY(16) NULL;
