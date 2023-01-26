CREATE TABLE IF NOT EXISTS bng.application_session
(
  application_session_id BIGSERIAL CONSTRAINT pk_application_session_application_session_id PRIMARY KEY,
  application_reference VARCHAR(20) CONSTRAINT uq_application_session_application_reference UNIQUE NOT NULL,
  email TEXT NOT NULL,
  application_session json NOT NULL,
  date_created TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'utc'),
  date_modified TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'utc'),
  CONSTRAINT fk_application_reference 
    FOREIGN KEY (application_reference) 
    REFERENCES bng.application_reference(application_reference)
);