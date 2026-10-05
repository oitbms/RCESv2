ALTER TABLE rces.employees DROP CONSTRAINT check_notification_app;
ALTER TABLE rces.employees
    ADD CONSTRAINT check_notification_app
        CHECK (notification_app IN ('TELEGRAM', 'VK', 'MAX', 'BITRIX'));