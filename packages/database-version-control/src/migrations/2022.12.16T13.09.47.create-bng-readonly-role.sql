DO
$$
BEGIN
  IF NOT EXISTS (SELECT * FROM pg_user WHERE usename = 'bng_readonly') THEN
     CREATE ROLE bng_readonly;
  END IF;
END
$$
;
