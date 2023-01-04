DO
$$
BEGIN
  IF NOT EXISTS (select nspname from pg_catalog.pg_namespace where nspname = 'bng') THEN
     CREATE SCHEMA bng;
     GRANT USAGE ON SCHEMA bng to bng_readwrite;
     GRANT USAGE ON SCHEMA bng to bng_readonly;
     ALTER DEFAULT PRIVILEGES IN SCHEMA bng GRANT SELECT ON TABLES TO bng_readonly;
     ALTER DEFAULT PRIVILEGES IN SCHEMA bng GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO bng_readwrite;
     ALTER DEFAULT PRIVILEGES IN SCHEMA bng GRANT USAGE, SELECT ON SEQUENCES TO bng_readwrite;
  END IF;
END
$$
;
