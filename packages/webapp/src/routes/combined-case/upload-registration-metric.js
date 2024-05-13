import { deleteBlobFromContainers } from '../../utils/azure-storage.js'
import { buildConfig } from '../../utils/build-upload-config.js'
import { uploadFile } from '../../utils/upload.js'
import { getMaximumFileSizeExceededView, getMetricFileValidationErrors } from '../../utils/helpers.js'
import combinedCaseConstants from '../../utils/combined-case/constants.js'
import constants from '../../utils/constants.js'

const UPLOAD_CREDIT_METRIC_ID = '#uploadMetric'
const thisView = combinedCaseConstants.views.COMBINED_CASE_REGISTRATION_UPLOAD_METRIC

const processSuccessfulCreditUpload = async (result, request, h) => {
  const validationError = getMetricFileValidationErrors(result.postProcess.metricData?.validation)
  if (validationError) {
    await deleteBlobFromContainers(result.config.blobConfig.blobName)
    return h.view(thisView, {
      ...validationError
    })
  }

  request.yar.set(combinedCaseConstants.redisKeys.COMBINED_CASE_REGISTRATION_METRIC_DATA, result.postProcess.metricData)
  request.logger.info(`${new Date().toUTCString()} Received metric data for ${result.config.blobConfig.blobName.substring(result.config.blobConfig.blobName.lastIndexOf('/') + 1)}`)
  return h.redirect(combinedCaseConstants.routes.COMBINED_CASE_ALLOCATION_UPLOAD_METRIC)
}

const handlers = {
  get: async (request, h) => {
    request.yar.clear(combinedCaseConstants.redisKeys.COMBINED_CASE_ALLOCATION_HABITATS)
    request.yar.clear(combinedCaseConstants.redisKeys.COMBINED_CASE_REGISTRATION_HABITATS)

    return h.view(thisView)
  },
  post: async (request, h) => {
    const uploadConfig = buildConfig({
      sessionId: request.yar.id,
      fileExt: constants.metricFileExt,
      maxFileSize: parseInt(process.env.MAX_METRIC_UPLOAD_MB) * 1024 * 1024,
      uploadType: 'metric-upload',
      postProcess: true
    })

    try {
      const metricUploadResult = await uploadFile(request.logger, request, uploadConfig)
      return processSuccessfulCreditUpload(metricUploadResult, request, h)
    } catch (err) {
      request.logger.info(`${new Date().toUTCString()} Problem uploading credits metric file ${err}`)
      h.view(thisView, {
        err: [{
          text: 'Error during upload',
          href: UPLOAD_CREDIT_METRIC_ID
        }]
      })
    }
  }
}

export default [{
  method: 'GET',
  path: combinedCaseConstants.routes.COMBINED_CASE_REGISTRATION_UPLOAD_METRIC,
  handler: handlers.get
},
{
  method: 'POST',
  path: combinedCaseConstants.routes.COMBINED_CASE_REGISTRATION_UPLOAD_METRIC,
  config: {
    handler: handlers.post,
    payload: {
      output: 'stream',
      multipart: true,
      timeout: false,
      parse: false,
      allow: 'multipart/form-data',
      maxBytes: (parseInt(process.env.MAX_METRIC_UPLOAD_MB) + 1) * 1024 * 1024,
      failAction: (req, h, err) => {
        req.logger.info(`${new Date().toUTCString()} File upload too large ${req.path}`)

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
    maximumFileSize: process.env.MAX_METRIC_UPLOAD_MB,
    view: combinedCaseConstants.views.COMBINED_CASE_REGISTRATION_UPLOAD_METRIC,
    href: UPLOAD_CREDIT_METRIC_ID,
    h
  })
}
