import constants from '../../utils/constants.js'
import { deleteBlobFromContainers } from '../../utils/azure-storage.js'
import { logger } from 'defra-logging-facade'

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

const filterByBGN = (metricSheetRows, request) => metricSheetRows?.filter(row =>
  row['Register reference number'] === request.yar.get(constants.redisKeys.BIODIVERSITY_NET_GAIN_NUMBER))
const getContext = request => {
  const metricData = request.yar.get(constants.redisKeys.DEVELOPER_METRIC_DATA)
  logger.info('metricData', metricData)
  const d1OffSiteHabitatBaseline = filterByBGN(metricData?.d1OffSiteHabitatBaseline, request)
  const e1OffSiteHedgeBaseline = filterByBGN(metricData?.e1OffSiteHedgeBaseline, request)
  const noOfHabitatUnits = getNumOfUnits(
    d1OffSiteHabitatBaseline,
    'Broad habitat',
    'Area (hectares)')
  const noOfHedgerowUnits = getNumOfUnits(
    e1OffSiteHedgeBaseline,
    'Hedgerow type',
    'Length (km)')
  logger.info('d1OffSiteHabitatBaseline', d1OffSiteHabitatBaseline)
  logger.info('e1OffSiteHedgeBaseline', e1OffSiteHedgeBaseline)
  return {
    offSiteHabitats: {
      items: d1OffSiteHabitatBaseline,
      total: noOfHabitatUnits
    },
    offSiteHedgerows: {
      items: e1OffSiteHedgeBaseline,
      total: noOfHedgerowUnits
    },
    gainSiteNumber: request.yar.get(constants.redisKeys.BIODIVERSITY_NET_GAIN_NUMBER)
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
