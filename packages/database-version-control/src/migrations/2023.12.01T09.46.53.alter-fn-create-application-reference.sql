DROP FUNCTION bng.fn_create_application_reference (UUID, bng.APPLICATION_TYPE, INTEGER);
CREATE FUNCTION bng.fn_create_application_reference
  (contact_id UUID,
	 application_type bng.APPLICATION_TYPE,
   organisation_id UUID,
	 number_of_retries INTEGER DEFAULT 5)
RETURNS VARCHAR(18)
  LANGUAGE plpgsql
  AS
$$
DECLARE
  insert_application_reference VARCHAR(18);
  insert_id UUID;
  first_random_string VARCHAR(5) := upper(bng.fn_random_string(5));
  second_random_string VARCHAR(4) := upper(bng.fn_random_string(4));
BEGIN
	INSERT INTO
	bng.application_reference(contact_id, application_type, organisation_id)
  VALUES
	(contact_id, application_type, organisation_id)
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
      RETURN bng.fn_create_application_reference(contact_id, application_type, organisation_id, number_of_retries - 1);
    ELSE
      RAISE;
    END IF;
  WHEN OTHERS THEN
    RAISE;
END;
$$;

