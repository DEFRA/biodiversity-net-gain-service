DO
$$
BEGIN
  IF NOT EXISTS (SELECT * FROM pg_user WHERE usename = 'bng_readwrite') THEN
     CREATE ROLE bng_readwrite;
  END IF;
END
$$
;
