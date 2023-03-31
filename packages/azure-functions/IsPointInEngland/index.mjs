import { getDBConnection } from '@defra/bng-utils-lib'
import { isPointInEngland } from '../Shared/db-queries.js'

export default async function (context, req) {
  context.log('Processing', JSON.stringify(req.body))
  let db
  try {
    const point = req.body.point

    // do some basic validation around the point value
    if (!point || isNaN(point.easting) || isNaN(point.northing)) {
      throw new Error('Point is invalid')
    }

    const { fn_is_point_in_england_27700: isPointInEnglandResponse } = (await isPointInEngland(await getDBConnection(), [point.easting, point.northing])).rows[0]

    context.res = {
      status: 200,
      body: {
        isPointInEngland: isPointInEnglandResponse
      }
    }
  } catch (err) {
    context.log.error(err)
    context.res = {
      status: 400,
      body: JSON.stringify(err)
    }
  } finally {
    await db?.end()
  }
}
