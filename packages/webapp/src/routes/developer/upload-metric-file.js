import { logger } from 'defra-logging-facade'
import { ThreatScreeningError, UploadTypeValidationError } from '@defra/bng-errors-lib'
import { buildConfig } from '../../utils/build-upload-config.js'
import constants from '../../utils/constants.js'
import { uploadFiles } from '../../utils/upload.js'
import { processDeveloperTask } from '../../utils/helpers.js'

const invalidUploadErrorText = 'The selected file must be an XLSM or XLSX'
const DEVELOPER_UPLOAD_METRIC_ID = '#uploadMetric'

const handlers = {
  get: async (_request, h) => h.view(constants.views.DEVELOPER_UPLOAD_METRIC),
  post: async (request, h) => performUpload(request, h)
}

const performUpload = async (request, h) => {
  const config = buildConfig({
    sessionId: request.yar.id,
    uploadType: constants.uploadTypes.DEVELOPER_METRIC_UPLOAD_TYPE,
    fileExt: constants.metricFileExt,
    maxFileSize: parseInt(process.env.MAX_METRIC_UPLOAD_MB) * 1024 * 1024
  })

  try {
    const metricFileData = await uploadFiles(logger, request, config)
    if (metricFileData) {
      const uploadedFileLocation = `${metricFileData[0].location.substring(0, metricFileData[0].location.lastIndexOf('/'))}/${metricFileData.filename}`
      if (metricFileData[0].location !== uploadedFileLocation) {
        request.yar.set(constants.redisKeys.DEVELOPER_ORIGINAL_METRIC_UPLOAD_LOCATION, uploadedFileLocation)
      }
      request.yar.set(constants.redisKeys.DEVELOPER_METRIC_DATA, metricFileData[0].metricData)
      request.yar.set(constants.redisKeys.DEVELOPER_METRIC_LOCATION, metricFileData[0].location)
      request.yar.set(constants.redisKeys.DEVELOPER_METRIC_FILE_NAME, metricFileData.filename)
      request.yar.set(constants.redisKeys.DEVELOPER_METRIC_FILE_SIZE, metricFileData.fileSize)
      request.yar.set(constants.redisKeys.DEVELOPER_METRIC_FILE_TYPE, metricFileData.fileType)
    }
    processDeveloperTask(request,
      {
        taskTitle: 'Biodiversity 4.0 Metric calculations',
        title: 'Upload Metric 4.0 file'
      }, {
        status: constants.IN_PROGRESS_DEVELOPER_TASK_STATUS
      })
    return h.redirect(constants.routes.DEVELOPER_CHECK_UPLOAD_METRIC)
  } catch (err) {
    const errorContext = getErrorContext(err)
    return h.view(constants.views.DEVELOPER_UPLOAD_METRIC, errorContext)
  }
}

const getErrorContext = err => {
  const error = {}
  if (err instanceof ThreatScreeningError) {
    const status = err.threatScreeningDetails.Status
    error.err = [{
      text: status === constants.threatScreeningStatusValues.QUARANTINED ? constants.uploadErrors.threatDetected : constants.uploadErrors.uploadFailure,
      href: DEVELOPER_UPLOAD_METRIC_ID
    }]
  } else if (err instanceof UploadTypeValidationError || err.message === constants.uploadErrors.unsupportedFileExt) {
    error.err = [{
      text: invalidUploadErrorText,
      href: DEVELOPER_UPLOAD_METRIC_ID
    }]
  } else {
    processErrorMessage(err.message, error)
  }

  if (error.err) {
    // Prepare to redisplay the upload developer metric view with the configured error.
    return error
  } else {
    // An unexpected error has occurred. Rethrow it so that the default error page is returned.
    throw err
  }
}

const processErrorMessage = (errorMessage, error) => {
  switch (errorMessage) {
    case constants.uploadErrors.noFile:
      error.err = [{
        text: 'Select a Biodiversity Metric',
        href: DEVELOPER_UPLOAD_METRIC_ID
      }]
      break
    case constants.uploadErrors.emptyFile:
      error.err = [{
        text: 'The selected file is empty',
        href: DEVELOPER_UPLOAD_METRIC_ID
      }]
      break
    case constants.uploadErrors.maximumFileSizeExceeded:
      error.err = [{
        text: `The selected file must not be larger than ${process.env.MAX_METRIC_UPLOAD_MB}MB`,
        href: DEVELOPER_UPLOAD_METRIC_ID
      }]
      break
    default:
      if (errorMessage.indexOf('timed out') > 0) {
        error.err = [{
          text: constants.uploadErrors.uploadFailure,
          href: DEVELOPER_UPLOAD_METRIC_ID
        }]
      }
      break
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
      maxBytes: (parseInt(process.env.MAX_METRIC_UPLOAD_MB) + 1) * 1024 * 1024,
      output: 'stream',
      timeout: false,
      parse: false,
      multipart: true,
      allow: 'multipart/form-data',
      failAction: (req, h, error) => {
        logger.log(`${new Date().toUTCString()} Uploaded file is too large ${req.path}`)
        if (error.output.statusCode === 413) { // Request entity too large
          return h.view(constants.views.DEVELOPER_UPLOAD_METRIC, {
            err: [
              {
                text: `The selected file must not be larger than ${process.env.MAX_METRIC_UPLOAD_MB}MB`,
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
}]
