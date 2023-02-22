CREATE INDEX IF NOT EXISTS ix_england_010k_4326_geometry
  ON bng.england_010k_4326
  USING gist(geometry);

ALTER TABLE bng.england_010k_4326 CLUSTER ON ix_england_010k_4326_geometry;