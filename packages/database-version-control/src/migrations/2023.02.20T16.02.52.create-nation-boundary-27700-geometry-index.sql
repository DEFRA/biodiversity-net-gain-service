CREATE INDEX IF NOT EXISTS ix_nation_boundary_27700_geometry
  ON bng.nation_boundary_27700
  USING gist(geometry);

ALTER TABLE bng.nation_boundary_27700 CLUSTER ON ix_nation_boundary_27700_geometry;

