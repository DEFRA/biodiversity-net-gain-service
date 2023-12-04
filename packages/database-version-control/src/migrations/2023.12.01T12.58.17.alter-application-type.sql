DO
$$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'APPLICATION_TYPE' and typnamespace = 'bng'::regnamespace) THEN
    ALTER TYPE bng.APPLICATION_TYPE ADD VALUE 'Credits';
  END IF;
END
$$