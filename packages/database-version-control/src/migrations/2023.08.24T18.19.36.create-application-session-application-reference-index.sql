CREATE INDEX IF NOT EXISTS ix_application_session_application_reference
    ON bng.application_session USING btree
    (application_reference);
