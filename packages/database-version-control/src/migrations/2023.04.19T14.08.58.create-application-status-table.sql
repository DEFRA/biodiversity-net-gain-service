CREATE TABLE IF NOT EXISTS bng.application_status
(
	application_status_id UUID CONSTRAINT pk_application_status_application_status_id PRIMARY KEY DEFAULT uuid_generate_v4(),
	application_reference VARCHAR(20),
  application_status VARCHAR(20),
	date_created TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'utc'),
  date_modified TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'utc'),
  CONSTRAINT fk_application_reference
    FOREIGN KEY (application_reference)
    REFERENCES bng.application_reference(application_reference)
);
