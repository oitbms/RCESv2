ALTER TABLE rces.requests ADD COLUMN parent_request_id BINARY(16) DEFAULT NULL;
ALTER TABLE rces.requests ADD FOREIGN KEY (parent_request_id) REFERENCES rces.requests (id);
ALTER TABLE rces_history.requests_history ADD COLUMN parent_request_id BINARY(16) DEFAULT NULL;
