CREATE INDEX IF NOT EXISTS ix_application_session_date_modified
    ON bng.application_session USING btree
    (date_modified ASC NULLS LAST);
