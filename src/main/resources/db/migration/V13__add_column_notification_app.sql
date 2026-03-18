ALTER TABLE rces.employees
    ADD COLUMN notification_app VARCHAR(50) NOT NULL DEFAULT 'TELEGRAM';

ALTER TABLE rces.employees
    ADD CONSTRAINT check_notification_app
        CHECK (notification_app IN ('TELEGRAM', 'VK', 'MAX'));

ALTER TABLE rces_history.employees_history
    ADD COLUMN notification_app VARCHAR(50);

ALTER TABLE rces_history.employees_history
    ADD CONSTRAINT check_history_notification_app
        CHECK (notification_app IN ('TELEGRAM', 'VK', 'MAX'));