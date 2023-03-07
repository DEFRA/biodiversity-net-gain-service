
const isPolygonInEnglandOnly = (db, values) => db.query('SELECT bng.fn_is_polygon_in_england_only($1);', values)

export {
  isPolygonInEnglandOnly
}
