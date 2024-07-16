UPDATE bng.application_reference
SET application_type = 'Registration'
WHERE application_type = 'CombinedCase';

ALTER TYPE bng.APPLICATION_TYPE RENAME TO APPLICATION_TYPE_old;
CREATE TYPE bng.APPLICATION_TYPE AS ENUM ('Registration', 'Allocation', 'CreditsPurchase');
ALTER TABLE bng.application_reference
ALTER COLUMN application_type TYPE bng.APPLICATION_TYPE
USING application_type::text::bng.APPLICATION_TYPE;
DROP TYPE bng.APPLICATION_TYPE_old;
