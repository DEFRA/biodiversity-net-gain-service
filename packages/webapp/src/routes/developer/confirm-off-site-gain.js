import constants from '../../utils/constants.js'
import { combineHabitats, habitatTypeAndConditionMapper } from '../../utils/helpers.js'
import habitatTypeMap from '../../utils/habitatTypeMap.js'

const extractHabitatsByGainSiteNumber = (metricData, gainSiteNumber) => {
  const filteredMetricData = {}
  const sheetLabels = ['d2', 'd3', 'e2', 'e3', 'f2', 'f3']

  sheetLabels.forEach(label => {
    filteredMetricData[label] = metricData[label].filter(habitat => String(habitat['Off-site reference']) === gainSiteNumber)

    // calculate the area based on the filtered out habitats and add to the habitat array
    // as the last entry, this is then used by habitatTypeAndConditionMapper later
    const unitKey = habitatTypeMap[label].unitKey
    const measurementTotal = filteredMetricData[label].reduce((acc, cur) => acc + cur[unitKey], 0)
    filteredMetricData[label].push({
      [unitKey]: measurementTotal
    })
  })

  return filteredMetricData
}

const getContext = request => {
  const metricData = request.yar.get(constants.redisKeys.DEVELOPER_METRIC_DATA)
  const gainSiteNumber = request.yar.get(constants.redisKeys.BIODIVERSITY_NET_GAIN_NUMBER)
  const uploadMetricFileRoute = constants.routes.DEVELOPER_UPLOAD_METRIC

  console.log(metricData)

  const filteredMetricData = extractHabitatsByGainSiteNumber(metricData, gainSiteNumber)
  const habitats = habitatTypeAndConditionMapper(['d2', 'd3', 'e2', 'e3', 'f2', 'f3'], filteredMetricData)
  const habitatTypeAndCondition = combineHabitats(habitats)

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
