import constants from '../../utils/constants.js'

const handlers = {
  get: (request, h) => {
    const context = getContext(request)
    return h.view(constants.views.DEVELOPER_CONFIRM_OFF_SITE_GAIN, context)
  },
  post: async (request, h) => {
    request.yar.set(constants.redisKeys.DEVELOPER_OFF_SITE_GAIN_CONFIRMED, true)
    return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.DEVELOPER_TASKLIST)
  }
}

const getNumOfUnits = (data, field1, field2) => (data || []).reduce((prev, item) => {
  if (item[field1] && !isNaN(item[field2])) {
    return prev + item[field2]
  }
  return prev
}, 0)

const filterByBGN = (metricSheetRows, request) => metricSheetRows?.filter(row =>
  String(row['Off-site reference']) === String(request.yar.get(constants.redisKeys.BIODIVERSITY_NET_GAIN_NUMBER)))
const getContext = request => {
  const metricData = request.yar.get(constants.redisKeys.DEVELOPER_METRIC_DATA)
  const uploadMetricFileRoute = constants.routes.DEVELOPER_UPLOAD_METRIC

  console.log(metricData)

  // FIXME: THIS IS ALL WRONG, SHOULD BE FROM 2 and 3 sheets
  const d1OffSiteHabitatBaseline = filterByBGN(metricData?.d1, request)
  const e1OffSiteHedgeBaseline = filterByBGN(metricData?.e1, request)
  const f1OffSiteHedgeBaseline = filterByBGN(metricData?.f1, request)

  const noOfHabitatUnits = getNumOfUnits(
    d1OffSiteHabitatBaseline,
    'Broad habitat',
    'Area (hectares)')
  const noOfHedgerowUnits = getNumOfUnits(
    e1OffSiteHedgeBaseline,
    'Habitat type',
    'Length (km)')
  const noOfWaterCourseUnits = getNumOfUnits(
    f1OffSiteHedgeBaseline,
    'Watercourse type',
    'Length (km)')

  return {
    offSiteHabitats: {
      items: d1OffSiteHabitatBaseline,
      total: noOfHabitatUnits
    },
    offSiteHedgerows: {
      items: e1OffSiteHedgeBaseline,
      total: noOfHedgerowUnits
    },
    offSiteWatercourses: {
      items: f1OffSiteHedgeBaseline,
      total: noOfWaterCourseUnits
    },
    gainSiteNumber: request.yar.get(constants.redisKeys.BIODIVERSITY_NET_GAIN_NUMBER),
    uploadMetricFileRoute
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_CONFIRM_OFF_SITE_GAIN,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.DEVELOPER_CONFIRM_OFF_SITE_GAIN,
  handler: handlers.post
}]
