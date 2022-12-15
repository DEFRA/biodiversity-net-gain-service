import constants from '../../utils/constants.js'
import path from 'path'
import { blobStorageConnector } from '@defra/bng-connectors-lib'
import { logger } from 'defra-logging-facade'
import { extractMetricData } from '../../utils/extract-developer-metric.js'
import { downloadStreamAndQueueMessage } from '../../utils/azure-storage.js'
import { handleEvents } from '../../utils/azure-signalr.js'

const href = '#check-upload-correct-yes'
const handlers = {
  get: async (request, h) => {
    const context = getContext(request)
    return h.view(constants.views.DEVELOPER_CHECK_UPLOAD_METRIC, context)
  },
  post: async (request, h) => {
    let errorMessage
    const checkUploadMetric = request.payload.checkUploadMetric
    const metricUploadLocation = request.yar.get(constants.redisKeys.DEVELOPER_METRIC_LOCATION)
    request.yar.set(constants.redisKeys.METRIC_FILE_CHECKED, checkUploadMetric)
    if (checkUploadMetric === constants.CHECK_UPLOAD_METRIC_OPTIONS.NO) {
      // delete the file from blob storage
      const config = {
        containerName: 'untrusted',
        blobName: metricUploadLocation
      }
      await blobStorageConnector.deleteBlobIfExists(config)
      request.yar.clear(constants.redisKeys.DEVELOPER_METRIC_LOCATION)
      return h.redirect(constants.routes.DEVELOPER_UPLOAD_METRIC)
    } else if (checkUploadMetric === constants.CHECK_UPLOAD_METRIC_OPTIONS.YES) {
      const metricFileName = request.yar.get(constants.redisKeys.DEVELOPER_METRIC_LOCATION)
      const config = buildConfig(request.yar.id, path.basename(metricFileName))
      try {
        const metricFileData = await extractMetricData(logger, config)
        request.yar.set(constants.redisKeys.DEVELOPER_METRIC_DATA, metricFileData[0].metricData)
        return h.redirect('/' + constants.views.DEVELOPER_CONFIRM_DEV_DETAILS)
      } catch (error) {
        logger.error(error)
        errorMessage = 'Sorry there is a problem with the service try again later.'
      }
    }
    errorMessage = 'Select yes if this is the correct file'
    return h.view(constants.views.DEVELOPER_CHECK_UPLOAD_METRIC, {
      filename: path.basename(metricUploadLocation),
      ...getContext(request),
      err: [
        {
          text: errorMessage,
          href
        }
      ]
    })
  }
}

const getContext = request => {
  const fileLocation = request.yar.get(constants.redisKeys.DEVELOPER_METRIC_LOCATION)
  return {
    filename: fileLocation === null ? '' : path.parse(fileLocation).base,
    fileSize: request.yar.get(constants.redisKeys.DEVELOPER_METRIC_FILE_SIZE)
  }
}

const buildConfig = (sessionId, fileName) => {
  const config = {}
  buildBlobConfig(sessionId, config, fileName)
  buildQueueConfig(config)
  buildFunctionConfig(config)
  buildSignalRConfig(sessionId, config)
  buildFileValidationConfig(config)
  return config
}

const buildBlobConfig = (sessionId, config, fileName) => {
  config.blobConfig = {
    blobName: `${sessionId}/${constants.uploadTypes.DEVELOPER_METRIC_UPLOAD_TYPE}/${fileName}`,
    containerName: 'trusted',
    fileName
  }
}

const buildQueueConfig = config => {
  config.queueConfig = {
    uploadType: constants.uploadTypes.DEVELOPER_METRIC_EXTRACTION_UPLOAD_TYPE,
    queueName: 'trusted-file-queue'
  }
}

const buildFunctionConfig = config => {
  config.functionConfig = {
    extractMetricFunction: downloadStreamAndQueueMessage,
    handleEventsFunction: handleEvents
  }
}

const buildSignalRConfig = (sessionId, config) => {
  config.signalRConfig = {
    eventProcessingFunction: null,
    timeout: parseInt(process.env.UPLOAD_PROCESSING_TIMEOUT_MILLIS) || 180000,
    url: `${process.env.SIGNALR_URL}?userId=${sessionId}`
  }
}

const buildFileValidationConfig = config => {
  config.fileValidationConfig = {
    fileExt: constants.metricFileExt
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_CHECK_UPLOAD_METRIC,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.DEVELOPER_CHECK_UPLOAD_METRIC,
  handler: handlers.post
}]
