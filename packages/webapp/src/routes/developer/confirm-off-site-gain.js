import constants from '../../utils/constants.js'
import { processDeveloperTask } from '../../utils/helpers.js'

const handlers = {
  get: (request, h) => {
    const context = getContext(request)
    return h.view(constants.views.DEVELOPER_CONFIRM_OFF_SITE_GAIN, context)
  },
  post: async (request, h) => {
    processDeveloperTask(request,
      {
        taskTitle: 'Biodiversity 4.1 Metric calculations',
        title: 'Confirm off-site gain'
      }, { status: constants.COMPLETE_DEVELOPER_TASK_STATUS })
    return h.redirect(request.yar.get(constants.cacheKeys.REFERER, true) || constants.routes.DEVELOPER_TASKLIST)
  }
}

const getNumOfUnits = (data, field1, field2) => (data || []).reduce((prev, item) => {
  if (item[field1] && !isNaN(item[field2])) {
    return prev + item[field2]
  }
  return prev
}, 0)

const filterByBGN = (metricSheetRows, request) => metricSheetRows?.filter(row =>
  String(row['Off-site reference']) === String(request.yar.get(constants.cacheKeys.BIODIVERSITY_NET_GAIN_NUMBER)))
const getContext = request => {
  const metricData = request.yar.get(constants.cacheKeys.DEVELOPER_METRIC_DATA)
  const uploadMetricFileRoute = constants.routes.DEVELOPER_UPLOAD_METRIC

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
    gainSiteNumber: request.yar.get(constants.cacheKeys.BIODIVERSITY_NET_GAIN_NUMBER),
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
