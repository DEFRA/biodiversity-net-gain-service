import constants from '../../utils/constants.js'
import { deleteBlobFromContainers } from '../../utils/azure-storage.js'

const href = '#offsite-details-checked-yes'
const handlers = {
  get: (request, h) => {
    const context = getContext(request)
    return h.view(constants.views.DEVELOPER_CONFIRM_OFF_SITE_GAIN, {
      ...context.offSiteHedgerowTableContent,
      ...context.offSiteHabitatTableContent,
      ...context
    })
  },
  post: async (request, h) => {
    const confirmOffsiteGain = request.payload.confirmOffsiteGain
    const metricUploadLocation = request.yar.get(constants.redisKeys.DEVELOPER_METRIC_LOCATION)
    request.yar.set(constants.redisKeys.CONFIRM_OFFSITE_GAIN_CHECKED, confirmOffsiteGain)
    if (confirmOffsiteGain === constants.DEVELOPER_CONFIRM_OFF_SITE_GAIN.NO) {
      await deleteBlobFromContainers(metricUploadLocation)
      request.yar.clear(constants.redisKeys.DEVELOPER_METRIC_LOCATION)
      return h.redirect(constants.routes.DEVELOPER_UPLOAD_METRIC)
    } else if (confirmOffsiteGain === constants.DEVELOPER_CONFIRM_OFF_SITE_GAIN.YES) {
      return h.redirect(constants.routes.DEVELOPER_TASKLIST)
    } else {
      const context = getContext(request)
      return h.view(constants.views.DEVELOPER_CONFIRM_OFF_SITE_GAIN, {
        ...context.offSiteHedgerowTableContent,
        ...context.offSiteHabitatTableContent,
        ...context,
        err: [
          {
            text: 'Select yes if this is the correct file',
            href
          }
        ]
      })
    }
  }
}

const getNumOfUnits = (data, field1, field2) => (data || []).reduce((prev, item) => {
  if (item[field1] && !isNaN(item[field2])) {
    return prev + item[field2]
  }
  return prev
}, 0)

const getContext = request => {
  const metricData = request.yar.get(constants.redisKeys.DEVELOPER_METRIC_DATA)
  const noOfHabitatUnits = getNumOfUnits(metricData?.d1OffSiteHabitatBaseline, 'Broad habitat', 'Area (hectares)')
  const noOfHedgerowUnits = getNumOfUnits(metricData?.e1OffSiteHedgeBaseline, 'Hedgerow type', 'Length (km)')
  return {
    offSiteHabitats: {
      items: metricData?.d1OffSiteHabitatBaseline,
      total: noOfHabitatUnits
    },
    offSiteHedgerows: {
      items: metricData?.e1OffSiteHedgeBaseline,
      total: noOfHedgerowUnits
    }
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
