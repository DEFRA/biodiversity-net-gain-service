CREATE TABLE bng.application_reference
(
	application_reference_id serial primary key,
	application_reference VARCHAR(20) DEFAULT null,
	date_created timestamp with time zone DEFAULT (now() at time zone 'utc')
);