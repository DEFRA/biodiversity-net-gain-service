CREATE TABLE IF NOT EXISTS bng.nation_boundary
(
	ogc_fid UUID CONSTRAINT pk_nation_boundary_ogc_fid PRIMARY KEY DEFAULT uuid_generate_v4(),
  nation CHARACTER VARYING(8) NOT NULL, 
  geometry GEOMETRY(MultiPolygon, 27700) NOT NULL
);
