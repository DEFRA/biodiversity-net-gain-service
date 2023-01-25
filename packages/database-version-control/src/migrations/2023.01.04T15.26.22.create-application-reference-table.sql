CREATE TABLE IF NOT EXISTS bng.application_reference
(
	application_reference_id UUID CONSTRAINT pk_application_reference_application_reference_id PRIMARY KEY DEFAULT uuid_generate_v4(),
	application_reference VARCHAR(20) CONSTRAINT uk_application_reference_application_reference UNIQUE DEFAULT null,
	date_created TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'utc')
);
