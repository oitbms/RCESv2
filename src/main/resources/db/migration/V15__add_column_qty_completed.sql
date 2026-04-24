ALTER TABLE rces.requests
    ADD COLUMN qty_completed INT DEFAULT 0;

ALTER TABLE rces_history.requests_history
    ADD COLUMN qty_completed INT DEFAULT 0;