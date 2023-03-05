CREATE INDEX IF NOT EXISTS ix_nation_boundary_geometry
  ON bng.nation_boundary
  USING gist(geometry);

ALTER TABLE bng.nation_boundary CLUSTER ON ix_nation_boundary_geometry;

