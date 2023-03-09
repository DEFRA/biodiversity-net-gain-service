CREATE OR REPLACE FUNCTION bng.fn_is_polygon_in_england_only(
    _boundaryAsGeoJson text)
  RETURNS boolean AS
$BODY$

BEGIN

  BEGIN
    IF EXISTS (
      SELECT
        1
      FROM ( 
        SELECT
	        nation,
	        COUNT(nation) OVER () AS row_count
        FROM
	        bng.nation_boundary
        WHERE
	        st_intersects(st_setsrid(st_geomfromgeojson(_boundaryAsGeoJson), 27700), geometry)
      ) n
      WHERE
        n.nation = 'England'
        AND n.row_count = 1
    )
    THEN
      RETURN true;
    ELSE
      RETURN false;
    END IF;
  END;

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;