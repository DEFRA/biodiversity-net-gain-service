import constants from '../../utils/constants.js'
import { extractAllocationHabitatsByGainSiteNumber } from '../../utils/helpers.js'

const getContext = request => {
  const metricData = request.yar.get(constants.redisKeys.DEVELOPER_METRIC_DATA)
  const gainSiteNumber = request.yar.get(constants.redisKeys.BIODIVERSITY_NET_GAIN_NUMBER)
  const uploadMetricFileRoute = constants.routes.DEVELOPER_UPLOAD_METRIC
  const habitatTypeAndCondition = extractAllocationHabitatsByGainSiteNumber(metricData, gainSiteNumber)

  return {
    habitatTypeAndCondition,
    uploadMetricFileRoute
  }
}

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

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_CONFIRM_OFF_SITE_GAIN,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.DEVELOPER_CONFIRM_OFF_SITE_GAIN,
  handler: handlers.post
}]
