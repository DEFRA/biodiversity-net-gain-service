DO $$
BEGIN
  IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_CATALOG = 'bng' AND TABLE_SCHEMA = 'bng' AND TABLE_NAME = 'nation_boundary') THEN
    TRUNCATE TABLE bng.nation_boundary;
  END IF;
END
$$
