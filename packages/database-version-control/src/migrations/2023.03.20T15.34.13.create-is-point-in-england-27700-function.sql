CREATE OR REPLACE FUNCTION bng.fn_is_point_in_england_27700(
    _easting numeric,
    _northing numeric)
  RETURNS boolean AS
$BODY$
  BEGIN
    IF EXISTS (
      SELECT 1 
      FROM bng.nation_boundary_27700 
      WHERE st_intersects(st_setsrid(st_makepoint(_easting, _northing), 27700), geometry)
      AND nation = 'England'
    )
    THEN
      RETURN true;
    ELSE
      RETURN false;
    END IF;
  END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
