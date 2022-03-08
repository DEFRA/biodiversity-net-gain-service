CREATE DATABASE bng;

\connect bng;

CREATE EXTENSION IF NOT EXISTS postgis;

CREATE EXTENSION IF NOT EXISTS postgis_topology;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE SCHEMA u_bng;

--Need to sort out u_bng user role, search paths etc, see rds_initial_setup.sql from gitlab lfw project

CREATE TABLE IF NOT EXISTS u_bng.lr_national_polygon_27700 (
  id UUID DEFAULT uuid_generate_v4(),
  shape GEOMETRY(POLYGON, 27700),
  poly_id INTEGER NOT NULL,
  title_no TEXT NOT NULL,
  insert_timestamp TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  update_timestamp TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  rec_status CHARACTER(1),
  CONSTRAINT lr_national_polygon_27700_pkey PRIMARY KEY (id)   
);

CREATE TABLE IF NOT EXISTS u_bng.lr_national_polygon_4326 (
  id UUID DEFAULT uuid_generate_v4(),
  shape GEOMETRY(POLYGON, 4326),
  poly_id INTEGER NOT NULL,
  title_no TEXT NOT NULL,
  insert_timestamp TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  update_timestamp TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  rec_status CHARACTER(1),
  CONSTRAINT lr_national_polygon_4326_pkey PRIMARY KEY (id)   
);

CREATE TABLE IF NOT EXISTS u_bng.bng_gain_site_27700 (
  id UUID DEFAULT uuid_generate_v4(),
  shape GEOMETRY(MULTIPOLYGON, 27700),
  insert_timestamp TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT bng_gain_site_27700_pkey PRIMARY KEY (id)   
);

CREATE TABLE IF NOT EXISTS u_bng.bng_gain_site_4326 (
  id UUID DEFAULT uuid_generate_v4(),
  shape GEOMETRY(MULTIPOLYGON, 4326),
  insert_timestamp TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT bng_gain_site_4326_pkey PRIMARY KEY (id)   
);
