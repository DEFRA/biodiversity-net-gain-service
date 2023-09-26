CREATE INDEX IF NOT EXISTS ix_application_status_application_reference
    ON bng.application_status USING btree
    (application_reference);

