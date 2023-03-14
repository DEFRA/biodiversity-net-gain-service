CREATE OR REPLACE FUNCTION bng.fn_is_polygon_in_england_only_27700(
    _boundaryAsGeoJson text)
  RETURNS boolean AS
$$

BEGIN
  -- Check if any part of the polygon is in Scotland or Wales.
  IF EXISTS (
    SELECT
      1
    FROM (
      SELECT
        nation,
        COUNT(nation) OVER () AS row_count
      FROM
        bng.nation_boundary_27700
      WHERE
        st_intersects(st_setsrid(st_geomfromgeojson(_boundaryAsGeoJson), 27700), geometry)
    ) n
    WHERE
      n.nation = 'England'
      AND n.row_count = 1
  )
  THEN
    -- Check if any part of the polygon crosses the coastline of England.
    IF EXISTS (
      SELECT
        1
      FROM (
        SELECT
          nation
        FROM
          bng.nation_boundary_27700
        WHERE
          st_covers(geometry, st_setsrid(st_geomfromgeojson(_boundaryAsGeoJson), 27700))
          AND nation = 'England') a
    )
    THEN
      RETURN true;
    ELSE
      RETURN false;
    END IF;
  ELSE
    RETURN false;
  END IF;
END;

$$
  LANGUAGE plpgsql VOLATILE
  COST 100;
