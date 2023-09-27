CREATE INDEX IF NOT EXISTS ix_application_reference_contact_id_application_type
    ON bng.application_reference USING btree
    (contact_id, application_type);

