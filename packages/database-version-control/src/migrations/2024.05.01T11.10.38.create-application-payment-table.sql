CREATE TABLE IF NOT EXISTS bng.application_payment
(
    application_payment_id UUID CONSTRAINT pk_application_payment_application_payment_id PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_reference VARCHAR(20),
    payment_reference VARCHAR(40),
    payment_status VARCHAR(20),
    payment_amount VARCHAR(20),
	date_created TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'utc'),
    date_modified TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'utc'),
    CONSTRAINT fk_application_reference
    FOREIGN KEY (application_reference)
    REFERENCES bng.application_reference(application_reference)
);