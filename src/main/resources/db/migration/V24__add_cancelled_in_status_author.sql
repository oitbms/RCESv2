ALTER TABLE author_control
    DROP CONSTRAINT status_author_check;

ALTER TABLE author_control
    ADD CONSTRAINT status_author_check CHECK ( status_author IN
                                               ('NEW', 'PENDING_APPROVAL', 'AWAITING_FIX', 'NOT_APPROVED',
                                                'APPROVED', 'CANCELLED') );