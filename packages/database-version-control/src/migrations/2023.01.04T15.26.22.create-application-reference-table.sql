CREATE TABLE IF NOT EXISTS bng.application_reference
(
	application_reference_id UUID CONSTRAINT pk_application_reference_application_reference_id PRIMARY KEY DEFAULT uuid_generate_v4(),
	application_reference VARCHAR(18) CONSTRAINT uq_application_reference_application_reference UNIQUE DEFAULT NULL,
	contact_id UUID NOT NULL,
	application_type bng.APPLICATION_TYPE NOT NULL,
	date_of_expiry_notification TIMESTAMP WITH TIME ZONE,
	date_created TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'utc')
);
