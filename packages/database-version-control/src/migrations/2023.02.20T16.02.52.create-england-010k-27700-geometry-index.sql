CREATE INDEX IF NOT EXISTS ix_england_010k_27700_geometry
  ON bng.england_010k_27700
  USING gist(geometry);

ALTER TABLE bng.england_010k_27700 CLUSTER ON ix_england_010k_27700_geometry;

