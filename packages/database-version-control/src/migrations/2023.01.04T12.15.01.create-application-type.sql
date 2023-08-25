DO
$$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'APPLICATION_TYPE' and typnamespace = 'bng'::regnamespace) THEN
    CREATE TYPE bng.APPLICATION_TYPE AS ENUM ('Registration', 'Allocation');
  END IF;
END
$$