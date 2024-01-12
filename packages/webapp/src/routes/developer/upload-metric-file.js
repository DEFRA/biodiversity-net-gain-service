import { deleteBlobFromContainers } from '../../utils/azure-storage.js'
import { buildConfig } from '../../utils/build-upload-config.js'
import constants from '../../utils/constants.js'
import { uploadFile } from '../../utils/upload.js'
import { processDeveloperTask, getMaximumFileSizeExceededView, getMetricFileValidationErrors } from '../../utils/helpers.js'
import { ThreatScreeningError, MalwareDetectedError } from '@defra/bng-errors-lib'

const UPLOAD_METRIC_ID = '#uploadMetric'

const filterByBGN = (metricSheetRows, request) => metricSheetRows?.filter(row =>
  String(row['Off-site reference']) === String(request.yar.get(constants.redisKeys.BIODIVERSITY_NET_GAIN_NUMBER)))

const processSuccessfulUpload = async (result, request, h) => {
  const validationError = getMetricFileValidationErrors(result.postProcess.metricData?.validation, UPLOAD_METRIC_ID)
  if (validationError) {
    await deleteBlobFromContainers(result.config.blobConfig.blobName)
    return h.view(constants.views.DEVELOPER_UPLOAD_METRIC, validationError)
  }

  processDeveloperTask(request,
    {
      taskTitle: 'Biodiversity 4.1 Metric calculations',
      title: 'Upload Metric 4.1 file'
    }, {
      status: constants.IN_PROGRESS_DEVELOPER_TASK_STATUS
    })
  request.yar.set(constants.redisKeys.DEVELOPER_METRIC_LOCATION, result.config.blobConfig.blobName)
  request.yar.set(constants.redisKeys.DEVELOPER_METRIC_FILE_SIZE, result.fileSize)
  request.yar.set(constants.redisKeys.DEVELOPER_METRIC_FILE_TYPE, result.fileType)
  request.yar.set(constants.redisKeys.DEVELOPER_METRIC_DATA, result.postProcess.metricData)
  request.yar.set(constants.redisKeys.DEVELOPER_METRIC_FILE_NAME, result.filename)
  request.logger.info(`${new Date().toUTCString()} Received metric data for ${result.config.blobConfig.blobName.substring(result.config.blobConfig.blobName.lastIndexOf('/') + 1)}`)
  if (Array.isArray(result.postProcess.metricData?.d1) && filterByBGN(result.postProcess.metricData?.d1, request).length === 0 &&
    Array.isArray(result.postProcess.metricData?.e1) && filterByBGN(result.postProcess.metricData?.e1, request).length === 0) {
    const error = {
      err: [
        {
          text: 'The uploaded metric does not contain the off-site reference entered.'
        }
      ]
    }
    await deleteBlobFromContainers(result.config.blobConfig.blobName)
    return h.view(constants.views.DEVELOPER_UPLOAD_METRIC, error)
  }
  return h.redirect(constants.routes.DEVELOPER_CHECK_UPLOAD_METRIC)
}

const processErrorUpload = (err, h) => {
  switch (err.message) {
    case constants.uploadErrors.notValidMetric:
      return h.view(constants.views.UPLOAD_METRIC, {
        err: [{
          text: 'The selected file is not a valid Metric',
          href: UPLOAD_METRIC_ID
        }]
      })
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
      if (err instanceof ThreatScreeningError) {
        return h.view(constants.views.DEVELOPER_UPLOAD_METRIC, {
          err: [{
            text: constants.uploadErrors.malwareScanFailed,
            href: UPLOAD_METRIC_ID
          }]
        })
      } else if (err instanceof MalwareDetectedError) {
        return h.view(constants.views.DEVELOPER_UPLOAD_METRIC, {
          err: [{
            text: constants.uploadErrors.threatDetected,
            href: UPLOAD_METRIC_ID
          }]
        })
      } else {
        return h.view(constants.views.DEVELOPER_UPLOAD_METRIC, {
          err: [{
            text: constants.uploadErrors.uploadFailure,
            href: UPLOAD_METRIC_ID
          }]
        })
      }
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
      uploadType: constants.uploadTypes.DEVELOPER_METRIC_UPLOAD_TYPE,
      postProcess: true
    })

    try {
      const result = await uploadFile(request.logger, request, uploadConfig)
      return await processSuccessfulUpload(result, request, h)
    } catch (err) {
      request.logger.error(`${new Date().toUTCString()} Problem uploading file ${err}`)
      return processErrorUpload(err, h)
    }
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
