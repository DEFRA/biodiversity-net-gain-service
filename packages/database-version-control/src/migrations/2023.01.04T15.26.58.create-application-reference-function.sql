create function bng.fn_create_application_reference()
   returns VARCHAR(20) 
   language plpgsql
  as
$$
declare 
	insert_application_reference VARCHAR(20);
	insert_id numeric;
	insert_date timestamp;
begin
 	-- Do blank insert, get ID and datecreated
	INSERT INTO
	bng.application_reference
	DEFAULT VALUES
	returning application_reference_id, date_created INTO insert_id, insert_date;

	-- Do count for ID for that day using locale 'Europe/London'
	UPDATE bng.application_reference
	SET application_reference = (
		SELECT 'REF' || 
		TO_CHAR((insert_date AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/London'), 'YYMMDD') ||
		(
			SELECT CASE
			WHEN LENGTH(count(1)::text) > 4
			THEN count(1)::text
			ELSE TO_CHAR(count(1), 'fm0000')
			END
			FROM bng.application_reference 
			WHERE application_reference_id <= insert_id
			AND (date_created AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/London')::date = (insert_date AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/London')::date
		)		
	)
	WHERE application_reference_id = insert_id;
	
	SELECT application_reference 
	FROM bng.application_reference 
	WHERE application_reference_id = insert_id
	INTO insert_application_reference;
	
	RETURN insert_application_reference;

end;
$$
