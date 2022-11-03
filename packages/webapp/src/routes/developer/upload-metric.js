import { logger } from 'defra-logging-facade'
import { handleEvents } from '../../utils/azure-signalr.js'
import { uploadStreamAndQueueMessage } from '../../utils/azure-storage.js'
import constants from '../../utils/constants.js'
import { uploadFiles } from '../../utils/upload.js'
import dotenv from 'dotenv'
import Main from '../../../../bngdataextractor/src/main.js'

dotenv.config()

const DEVELOPER_UPLOAD_METRIC_ID = '#uploadMetric'

function processSuccessfulUpload (res, req) {
  let resultView = constants.views.INTERNAL_SERVER_ERROR
  let errorMessage = {}
  if ((parseFloat(res.fileSize) * 100) === 0) {
    resultView = constants.views.DEVELOPER_UPLOAD_METRIC
    errorMessage = {
      err: [{
        text: 'The selected file is empty',
        href: DEVELOPER_UPLOAD_METRIC_ID
      }]
    }
  } else if (res[0].errorMessage === undefined) {
    req.yar.set(constants.redisKeys.METRIC_LOCATION, res[0].location)
    req.yar.set(constants.redisKeys.METRIC_FILE_SIZE, res.fileSize)
    req.yar.set(constants.redisKeys.METRIC_FILE_TYPE, res.fileType)
    logger.log(`${new Date().toUTCString()} Received land boundary data for ${res[0].location.substring(res[0].location.lastIndexOf('/') + 1)}`)
    resultView = constants.routes.DEVELOPER_CHECK_UPLOAD_METRIC
  }
  return { resultView, errorMessage }
}

function processErrorUpload (err, h) {
  switch (err.message) {
    case constants.uploadErrors.noFile:
      return h.view(constants.views.DEVELOPER_UPLOAD_METRIC, {
        err: [{
          text: 'Select a Biodiversity Metric',
          href: DEVELOPER_UPLOAD_METRIC_ID
        }]
      })
    case constants.uploadErrors.unsupportedFileExt:
      return h.view(constants.views.DEVELOPER_UPLOAD_METRIC, {
        err: [{
          text: 'The selected file must be an XLSM or XLSX',
          href: DEVELOPER_UPLOAD_METRIC_ID
        }]
      })
    default:
      if (err.message.indexOf('timed out') > 0) {
        return h.redirect(constants.views.DEVELOPER_UPLOAD_METRIC, {
          err: [{
            text: 'The selected file could not be uploaded -- try again',
            href: DEVELOPER_UPLOAD_METRIC_ID
          }]
        })
      }
      throw err
  }
}

function processReturnValue (details, h) {
  return details.resultView === constants.routes.DEVELOPER_CHECK_UPLOAD_METRIC
    ? h.redirect(details.resultView, details.errorMessage)
    : h.view(details.resultView, details.errorMessage)
}

const handlers = {
  get: async (_request, h) => h.view(constants.views.DEVELOPER_UPLOAD_METRIC),
  post: async (request, h) => {
    const config = developerBuildConfig(request.yar.id)
    return uploadFiles(logger, request, config).then(
      async function (result) {
        const viewDetails = processSuccessfulUpload(result, request)
        const envVars = EnvVars()
        const extractData = new Main(result['0'].location, envVars.AZURE_STORAGE_CONNECTION_STRING, envVars.AZURE_CONTAINER_NAME)
        try {
          const metricData = await extractData.getBlobData()
          console.info('Extracted metric data')
          console.log(metricData.startPage)
          request.yar.set(constants.redisKeys.DEVELOPER_METRIC_DATA, metricData)
        } catch (err) {
          console.error('Err: ', err)
        }
        return processReturnValue(viewDetails, h)
      },
      function (err) {
        return processErrorUpload(err, h)
      }
    ).catch(err => {
      console.log(`Problem uploading file ${err}`)
      return h.view(constants.views.DEVELOPER_UPLOAD_METRIC, {
        err: [{
          text: 'The selected file could not be uploaded -- try again',
          href: DEVELOPER_UPLOAD_METRIC_ID
        }]
      })
    })
  }
}

const developerBuildConfig = sessionId => {
  const config = {}
  developerBuildBlobConfig(sessionId, config)
  developerBuildQueueConfig(config)
  developerBuildFunctionConfig(config)
  developerBuildSignalRConfig(sessionId, config)
  developerBuildFileValidationConfig(config)
  return config
}

const developerBuildBlobConfig = (sessionId, config) => {
  config.blobConfig = {
    blobName: `${sessionId}/${constants.uploadTypes.METRIC_UPLOAD_TYPE}/`,
    containerName: 'untrusted'
  }
}

const developerBuildQueueConfig = config => {
  config.queueConfig = {
    uploadType: constants.uploadTypes.METRIC_UPLOAD_TYPE,
    queueName: 'untrusted-file-queue'
  }
}

const developerBuildFunctionConfig = config => {
  config.functionConfig = {
    uploadFunction: uploadStreamAndQueueMessage,
    handleEventsFunction: handleEvents
  }
}

const developerBuildSignalRConfig = (sessionId, config) => {
  config.signalRConfig = {
    eventProcessingFunction: null,
    timeout: parseInt(process.env.UPLOAD_PROCESSING_TIMEOUT_MILLIS) || 180000,
    url: `${process.env.SIGNALR_URL}?userId=${sessionId}`
  }
}

const developerBuildFileValidationConfig = config => {
  config.fileValidationConfig = {
    fileExt: constants.metricFileExt
  }
}

const EnvVars = () => {
  return {
    AZURE_STORAGE_CONNECTION_STRING: process.env.AZURE_STORAGE_CONNECTION_STRING,
    AZURE_CONTAINER_NAME: process.env.AZURE_CONTAINER_NAME
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_UPLOAD_METRIC,
  handler: handlers.get
},
{
  method: 'POST',
  path: constants.routes.DEVELOPER_UPLOAD_METRIC,
  config: {
    handler: handlers.post,
    payload: {
      maxBytes: (parseInt(process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB) + 1) * 1024 * 1024,
      output: 'stream',
      timeout: false,
      parse: false,
      multipart: true,
      allow: 'multipart/form-data',
      failAction: (req, h, error) => {
        console.log('Uploaded file is too large', req.path)
        if (error.output.statusCode === 413) { // Request entity too large
          return h.view(constants.views.DEVELOPER_UPLOAD_METRIC, {
            err: [
              {
                text: 'The selected file must not be larger than 50MB',
                href: DEVELOPER_UPLOAD_METRIC_ID
              }
            ]
          }).takeover()
        } else {
          throw error
        }
      }
    }
  }
}
]
