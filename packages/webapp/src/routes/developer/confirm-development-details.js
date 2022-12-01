import constants from '../../utils/constants.js'
import path from 'path'
import { blobStorageConnector } from '@defra/bng-connectors-lib'
import { logger } from 'defra-logging-facade'
import BngExtractionService from '../../../../bng-metric-service/src/BngMetricExtractionService.js'
import { Readable } from 'stream'

const href = '#dev-details-checked-yes'
const handlers = {
  get: async (request, h) => {
    const context = await getContext(request)
    return h.view(constants.views.DEVELOPER_CONFIRM_DEV_DETAILS, context)
  },
  post: async (request, h) => {
    const confirmDevDetails = request.payload.confirmDevDetails
    const metricUploadLocation = request.yar.get(constants.redisKeys.DEVELOPER_METRIC_LOCATION)
    request.yar.set(constants.redisKeys.METRIC_FILE_CHECKED, confirmDevDetails)
    if (confirmDevDetails === constants.CONFIRM_DEVELOPMENT_DETAILS.NO) {
      // delete the file from blob storage
      const config = {
        containerName: 'untrusted',
        blobName: metricUploadLocation
      }
      await blobStorageConnector.deleteBlobIfExists(config)
      request.yar.clear(constants.redisKeys.DEVELOPER_METRIC_LOCATION)
      return h.redirect(constants.routes.DEVELOPER_UPLOAD_METRIC)
    } else if (confirmDevDetails === constants.CONFIRM_DEVELOPMENT_DETAILS.YES) {
      return h.redirect('/' + constants.views.DEVELOPER_CONFIRM_DEV_DETAILS)
    } else {
      return h.view(constants.views.DEVELOPER_CHECK_UPLOAD_METRIC, {
        filename: path.basename(metricUploadLocation),
        ...await getContext(request),
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

const getContext = async request => {
  const blobName = request.yar.get(constants.redisKeys.DEVELOPER_METRIC_LOCATION)
  const config = {
    blobName,
    containerName: 'untrusted'
  }
  const extractService = new BngExtractionService()
  const buffer = await blobStorageConnector.downloadToBufferIfExists(logger, config)
  const readableStream = Readable.from(buffer)
  const metricData = await extractService.extractMetricContent(readableStream)
  request.yar.set(constants.redisKeys.DEVELOPER_METRIC_DATA, metricData)
  return {
    startPage: metricData.startPage
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_CONFIRM_DEV_DETAILS,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.DEVELOPER_CONFIRM_DEV_DETAILS,
  handler: handlers.post
}]
