CREATE TABLE IF NOT EXISTS bng.application_session
(
  application_session_id UUID CONSTRAINT pk_application_session_application_session_id PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_reference VARCHAR(20) CONSTRAINT uq_application_session_application_reference UNIQUE NOT NULL,
  application_session JSON NOT NULL,
  date_of_expiry_notification TIMESTAMP WITH TIME ZONE,
  date_created TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'utc'),
  date_modified TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'utc'),
  CONSTRAINT fk_application_reference 
    FOREIGN KEY (application_reference) 
    REFERENCES bng.application_reference(application_reference)
);