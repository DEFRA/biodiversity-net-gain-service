import constants from '../../utils/constants.js'
import { blobStorageConnector } from '@defra/bng-connectors-lib'

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
    if (confirmOffsiteGain === constants.CONFIRM_OFF_SITE_GAIN.NO) {
      // delete the file from blob storage
      const config = {
        containerName: 'trusted',
        blobName: metricUploadLocation
      }
      await blobStorageConnector.deleteBlobIfExists(config)
      request.yar.clear(constants.redisKeys.DEVELOPER_METRIC_LOCATION)
      return h.redirect(constants.routes.DEVELOPER_UPLOAD_METRIC)
    } else if (confirmOffsiteGain === constants.CONFIRM_OFF_SITE_GAIN.YES) {
      return h.redirect('/#')
    } else {
      return h.view(constants.views.DEVELOPER_CONFIRM_OFF_SITE_GAIN, {
        ...await getContext(request),
        err: [
          {
            text: 'Select yes if this is the correct data',
            href
          }
        ]
      })
    }
  }
}

const getNumOfUnits = (data, field1, field2) => (data || []).reduce((prev, item) => {
  const area = item[field1] && !isNaN(item[field2]) ? item[field2] : 0
  return prev + area
}, 0)

const getContext = request => {
  const metricData = request.yar.get(constants.redisKeys.DEVELOPER_METRIC_DATA)

  const noOfHabitatUnits = getNumOfUnits(metricData?.d1, 'Broad habitat', 'Area (hectares)')
  const noOfHedgerowUnits = getNumOfUnits(metricData?.e1, 'Hedgerow type', 'Length (km)')

  return {
    offSiteHabitats: {
      items: metricData?.d1,
      total: noOfHabitatUnits
    },
    offSiteHedgerows: {
      items: metricData?.e1,
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
