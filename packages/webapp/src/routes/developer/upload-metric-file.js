import { deleteBlobFromContainers } from '../../utils/azure-storage.js'
import { buildConfig } from '../../utils/build-upload-config.js'
import constants from '../../utils/constants.js'
import { uploadFile } from '../../utils/upload.js'
import { generatePayloadOptions } from '../../utils/generate-payload-options.js'
import { processErrorUpload } from '../../utils/upload-error-handler.js'
import { getMetricFileValidationErrors } from '../../utils/helpers.js'

const DEVELOPER_UPLOAD_METRIC_ID = '#uploadMetric'

async function processSuccessfulUpload (result, request, h) {
  const validationError = getMetricFileValidationErrors(result.postProcess.metricData?.validation, DEVELOPER_UPLOAD_METRIC_ID)
  if (validationError) {
    await deleteBlobFromContainers(result.config.blobConfig.blobName)
    return h.view(constants.views.DEVELOPER_UPLOAD_METRIC, validationError)
  }

  request.yar.set(constants.redisKeys.DEVELOPER_METRIC_LOCATION, result.config.blobConfig.blobName)
  request.yar.set(constants.redisKeys.DEVELOPER_METRIC_FILE_SIZE, result.fileSize)
  request.yar.set(constants.redisKeys.DEVELOPER_METRIC_FILE_TYPE, result.fileType)
  request.yar.set(constants.redisKeys.DEVELOPER_METRIC_DATA, result.postProcess.metricData)
  request.yar.set(constants.redisKeys.DEVELOPER_METRIC_FILE_NAME, result.filename)
  request.logger.info(`${new Date().toUTCString()} Received metric data for ${result.config.blobConfig.blobName.substring(result.config.blobConfig.blobName.lastIndexOf('/') + 1)}`)

  const hasBGS = checkBGS(result.postProcess.metricData, request.yar.get(constants.redisKeys.BIODIVERSITY_NET_GAIN_NUMBER))
  if (!hasBGS) {
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

const filterByBGN = (metricSheetRows, bgsNumber) => metricSheetRows?.filter(row =>
  String(row['Off-site reference']) === String(bgsNumber))

const checkBGS = (metricData, bgsNumber) => {
  const sheetsToCheck = ['d2', 'd3', 'e2', 'e3', 'f2', 'f3']

  for (const sheet of sheetsToCheck) {
    const sheetRows = metricData[sheet]

    if (Array.isArray(sheetRows) && filterByBGN(sheetRows, bgsNumber).length > 0) {
      return true
    }
  }

  return false
}

const handlers = {
  get: async (_request, h) => h.view(constants.views.DEVELOPER_UPLOAD_METRIC),
  post: async (request, h) => {
    const uploadConfig = buildConfig({
      sessionId: request.yar.id,
      uploadType: constants.uploadTypes.DEVELOPER_METRIC_UPLOAD_TYPE,
      fileExt: constants.metricFileExt,
      maxFileSize: parseInt(process.env.MAX_METRIC_UPLOAD_MB) * 1024 * 1024,
      postProcess: true
    })
    try {
      const result = await uploadFile(request.logger, request, uploadConfig)
      return await processSuccessfulUpload(result, request, h)
    } catch (err) {
      request.logger.error(`${new Date().toUTCString()} Problem uploading file ${err}`)
      return processErrorUpload({
        err,
        h,
        href: constants.views.DEVELOPER_UPLOAD_METRIC,
        noFileErrorMessage: 'Select a statutory biodiversity metric file no larger than 50MB, in the following format, XLSM or XLSX',
        unsupportedFileExtErrorMessage: 'The selected file must be an XLSM or XLSX',
        optionalErrorMessage: 'Upload a metric file',
        maximumFileSize: process.env.MAX_METRIC_UPLOAD_MB
      })
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
  handler: handlers.post,
  options:
      generatePayloadOptions(
        DEVELOPER_UPLOAD_METRIC_ID,
        process.env.MAX_METRIC_UPLOAD_MB,
        constants.views.DEVELOPER_UPLOAD_METRIC
      )
}]
