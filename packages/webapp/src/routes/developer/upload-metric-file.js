import { logger } from 'defra-logging-facade'
import { deleteBlobFromContainers } from '../../utils/azure-storage.js'
import { buildConfig } from '../../utils/build-upload-config.js'
import constants from '../../utils/constants.js'
import { uploadFiles } from '../../utils/upload.js'
import { processDeveloperTask, getMaximumFileSizeExceededView, getMetricFileValidationErrors } from '../../utils/helpers.js'

const UPLOAD_METRIC_ID = '#uploadMetric'

const filterByBGN = (metricSheetRows, request) => metricSheetRows?.filter(row =>
  String(row['Off-site reference']) === String(request.yar.get(constants.redisKeys.BIODIVERSITY_NET_GAIN_NUMBER)))

async function processSuccessfulUpload (result, request, h) {
  const validationError = getMetricFileValidationErrors(result[0].metricData.validation)
  if (validationError) {
    await deleteBlobFromContainers(result[0].location)
    return h.view(constants.views.DEVELOPER_UPLOAD_METRIC, validationError)
  }

  processDeveloperTask(request,
    {
      taskTitle: 'Biodiversity 4.0 Metric calculations',
      title: 'Upload Metric 4.0 file'
    }, {
      status: constants.IN_PROGRESS_DEVELOPER_TASK_STATUS
    })
  request.yar.set(constants.redisKeys.DEVELOPER_METRIC_LOCATION, result[0].location)
  request.yar.set(constants.redisKeys.DEVELOPER_METRIC_FILE_SIZE, result.fileSize)
  request.yar.set(constants.redisKeys.DEVELOPER_METRIC_FILE_TYPE, result.fileType)
  request.yar.set(constants.redisKeys.DEVELOPER_METRIC_DATA, result[0].metricData)
  request.yar.set(constants.redisKeys.DEVELOPER_METRIC_FILE_NAME, result.filename)
  logger.log(`${new Date().toUTCString()} Received metric data for ${result[0].location.substring(result[0].location.lastIndexOf('/') + 1)}`)
  if (filterByBGN(result[0].metricData?.d1, request).length <= 0 || filterByBGN(result[0].metricData?.e1, request) <= 0) {
    const error = {
      err: [
        {
          text: 'Enter the off-site reference that matches the off-site reference in the uploaded metric.'
        }
      ]
    }
    await deleteBlobFromContainers(result[0].location)
    return h.view(constants.views.DEVELOPER_UPLOAD_METRIC, error)
  }
  return h.redirect(constants.routes.DEVELOPER_CHECK_UPLOAD_METRIC)
}

function processErrorUpload (err, h) {
  switch (err.message) {
    case constants.uploadErrors.emptyFile:
      return h.view(constants.views.DEVELOPER_UPLOAD_METRIC, {
        err: [{
          text: 'The selected file is empty',
          href: UPLOAD_METRIC_ID
        }]
      })
    case constants.uploadErrors.noFile:
      return h.view(constants.views.DEVELOPER_UPLOAD_METRIC, {
        err: [{
          text: 'Select a Biodiversity Metric',
          href: UPLOAD_METRIC_ID
        }]
      })
    case constants.uploadErrors.unsupportedFileExt:
      return h.view(constants.views.DEVELOPER_UPLOAD_METRIC, {
        err: [{
          text: 'The selected file must be an XLSM or XLSX',
          href: UPLOAD_METRIC_ID
        }]
      })
    case constants.uploadErrors.maximumFileSizeExceeded:
      return maximumFileSizeExceeded(h)
    default:
      if (err.message.indexOf('timed out') > 0) {
        return h.redirect(constants.views.DEVELOPER_UPLOAD_METRIC, {
          err: [{
            text: 'The selected file could not be uploaded -- try again',
            href: UPLOAD_METRIC_ID
          }]
        })
      }
      throw err
  }
}

const handlers = {
  get: async (_request, h) => h.view(constants.views.DEVELOPER_UPLOAD_METRIC),
  post: async (request, h) => {
    // Get upload config object from common code
    const uploadConfig = buildConfig({
      sessionId: request.yar.id,
      fileExt: constants.metricFileExt,
      maxFileSize: parseInt(process.env.MAX_METRIC_UPLOAD_MB) * 1024 * 1024,
      uploadType: constants.uploadTypes.METRIC_UPLOAD_TYPE
    })

    return uploadFiles(logger, request, uploadConfig).then(
      result => processSuccessfulUpload(result, request, h),
      error => processErrorUpload(error, h)
    ).catch(error => {
      logger.info(`Problem uploading file ${error}`)
      return h.view(constants.views.DEVELOPER_UPLOAD_METRIC, {
        err: [{
          href: UPLOAD_METRIC_ID,
          text: 'The selected file could not be uploaded -- try again'
        }]
      })
    })
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
      parse: false,
      multipart: true,
      timeout: false,
      allow: 'multipart/form-data',
      failAction: (_request, h, err) => {
        if (err.output.statusCode === 413) { // Request entity too large
          return maximumFileSizeExceeded(h).takeover()
        } else {
          throw err
        }
      }
    }
  }
}
]

const maximumFileSizeExceeded = h => {
  return getMaximumFileSizeExceededView({
    h,
    href: UPLOAD_METRIC_ID,
    maximumFileSize: process.env.MAX_METRIC_UPLOAD_MB,
    view: constants.views.DEVELOPER_UPLOAD_METRIC
  })
}
