CREATE TABLE IF NOT EXISTS bng.application_reference
(
	application_reference_id SERIAL PRIMARY KEY,
	application_reference VARCHAR(20) DEFAULT null,
	date_created TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'utc')
);