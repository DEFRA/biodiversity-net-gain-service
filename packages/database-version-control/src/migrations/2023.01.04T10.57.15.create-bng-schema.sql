DO
$$
BEGIN
  IF NOT EXISTS (select nspname from pg_catalog.pg_namespace where nspname = 'bng') THEN
     CREATE SCHEMA bng;
  END IF;
END
$$
;
