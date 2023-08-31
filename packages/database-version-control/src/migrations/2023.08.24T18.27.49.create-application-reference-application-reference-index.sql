CREATE INDEX IF NOT EXISTS ix_application_reference_application_reference
    ON bng.application_reference USING btree
    (application_reference);
