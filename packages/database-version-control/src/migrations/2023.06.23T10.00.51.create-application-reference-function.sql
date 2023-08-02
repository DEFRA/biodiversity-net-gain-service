CREATE OR REPLACE FUNCTION bng.fn_create_application_reference(number_of_retries INTEGER DEFAULT 5)
-- Retain the original application refrence length until database structure changes
-- for Defra ID integration are made.
RETURNS VARCHAR(20) 
  LANGUAGE plpgsql
  AS
$$
DECLARE
  insert_application_reference VARCHAR(20);
  insert_id UUID;
  first_random_string VARCHAR(4) := upper(bng.fn_random_string(4));
  second_random_string VARCHAR(5) := upper(bng.fn_random_string(5));
BEGIN
  -- The revised application reference number format no longer contains a sequential number
  -- based on the number of application reference numbers generated each day. To minimise
  -- the number of additional migrations required to support the new format, retain population of the
  -- application_reference table until additional database structure changes for Defra ID integration
  -- are made.
  -- Before pre-production changes for Defra ID integration are made, all migrations will be rolled
  -- back in each cloud environment, allowing existing migrations to be refactored to make things as
  -- simple as possible accordingly.  
	INSERT INTO
	bng.application_reference
	DEFAULT VALUES
	returning application_reference_id INTO insert_id;

  UPDATE bng.application_reference
  SET application_reference = (
    SELECT 'BNGREG' || 
	  (SELECT CONCAT_WS('', '-', first_random_string)) || 
	  (SELECT CONCAT_WS('', '-', 'A', second_random_string))
  )
  WHERE application_reference_id = insert_id;
	
  SELECT application_reference 
  FROM bng.application_reference 
  WHERE application_reference_id = insert_id
  INTO insert_application_reference;
	
  RETURN insert_application_reference;
EXCEPTION
  WHEN UNIQUE_VIOLATION THEN
    IF number_of_retries > 0 THEN 
      RETURN bng.fn_create_application_reference(number_of_retries - 1);
    ELSE
      RAISE;
    END IF;
  WHEN OTHERS THEN
    RAISE;
END;
$$;

