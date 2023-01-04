DO
$$
BEGIN
  IF NOT EXISTS (select nspname from pg_catalog.pg_namespace where nspname = 'bng_user') THEN
     CREATE SCHEMA AUTHORIZATION bng_user;
  END IF;
END
$$
;
