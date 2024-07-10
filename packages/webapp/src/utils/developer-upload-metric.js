import { deleteBlobFromContainers } from './azure-storage.js'
import { getMetricFileValidationErrors, getMaximumFileSizeExceededView } from './helpers.js'
import constants from './constants.js'
import { ThreatScreeningError, MalwareDetectedError } from '@defra/bng-errors-lib'

export const UPLOAD_METRIC_ID = '#uploadMetric'

export const filterByBGN = (metricSheetRows, bgsNumber) => metricSheetRows?.filter(row =>
  String(row['Off-site reference']) === String(bgsNumber))

export const checkBGS = (metricData, bgsNumber) => {
  const sheetsToCheck = ['d2', 'd3', 'e2', 'e3', 'f2', 'f3']

  for (const sheet of sheetsToCheck) {
    const sheetRows = metricData[sheet]

    if (Array.isArray(sheetRows) && filterByBGN(sheetRows, bgsNumber).length > 0) {
      return true
    }
  }

  return false
}

export const processSuccessfulUpload = async (result, request, h, view) => {
  const validationError = getMetricFileValidationErrors(result.postProcess.metricData?.validation, UPLOAD_METRIC_ID)
  if (validationError) {
    await deleteBlobFromContainers(result.config.blobConfig.blobName)
    return h.view(view, validationError)
  }

  request.yar.set(constants.redisKeys.DEVELOPER_METRIC_LOCATION, result.config.blobConfig.blobName)
  request.yar.set(constants.redisKeys.DEVELOPER_METRIC_FILE_SIZE, result.fileSize)
  request.yar.set(constants.redisKeys.DEVELOPER_METRIC_FILE_TYPE, result.fileType)
  request.yar.set(constants.redisKeys.DEVELOPER_METRIC_DATA, result.postProcess.metricData)
  request.yar.set(constants.redisKeys.DEVELOPER_METRIC_FILE_NAME, result.filename)
  request.logger.info(`${new Date().toUTCString()} Received metric data for ${result.config.blobConfig.blobName.substring(result.config.blobConfig.blobName.lastIndexOf('/') + 1)}`)
  const hasBGS = checkBGS(result.postProcess.metricData, request.yar.get(constants.redisKeys.BIODIVERSITY_NET_GAIN_NUMBER))
  const applicationType = request.yar.get(constants.redisKeys.APPLICATION_TYPE)
  const isAllocation = applicationType === constants.applicationTypes.ALLOCATION
  if (!hasBGS && isAllocation) {
    const error = {
      err: [
        {
          text: 'The uploaded metric does not contain the off-site reference entered.'
        }
      ]
    }
    await deleteBlobFromContainers(result.config.blobConfig.blobName)
    return h.view(view, error)
  }
  return h.redirect(view === constants.views.COMBINED_CASE_UPLOAD_ALLOCATION_METRIC ? constants.routes.COMBINED_CASE_CHECK_UPLOAD_ALLOCATION_METRIC : constants.routes.DEVELOPER_CHECK_UPLOAD_METRIC)
}

export const processErrorUpload = (err, h, view) => {
  switch (err.message) {
    case constants.uploadErrors.notValidMetric:
      return h.view(view, {
        err: [{
          text: 'The selected file is not a valid Metric',
          href: UPLOAD_METRIC_ID
        }]
      })
    case constants.uploadErrors.emptyFile:
      return h.view(view, {
        err: [{
          text: 'The selected file is empty',
          href: UPLOAD_METRIC_ID
        }]
      })
    case constants.uploadErrors.noFile:
      return h.view(view, {
        err: [{
          text: 'Select a statutory biodiversity metric',
          href: UPLOAD_METRIC_ID
        }]
      })
    case constants.uploadErrors.unsupportedFileExt:
      return h.view(view, {
        err: [{
          text: 'The selected file must be an XLSM or XLSX',
          href: UPLOAD_METRIC_ID
        }]
      })
    case constants.uploadErrors.maximumFileSizeExceeded:
      return maximumFileSizeExceeded(h, view)
    default:
      if (err instanceof ThreatScreeningError) {
        return h.view(view, {
          err: [{
            text: constants.uploadErrors.malwareScanFailed,
            href: UPLOAD_METRIC_ID
          }]
        })
      } else if (err instanceof MalwareDetectedError) {
        return h.view(view, {
          err: [{
            text: constants.uploadErrors.threatDetected,
            href: UPLOAD_METRIC_ID
          }]
        })
      } else {
        return h.view(view, {
          err: [{
            text: constants.uploadErrors.uploadFailure,
            href: UPLOAD_METRIC_ID
          }]
        })
      }
  }
}

export const maximumFileSizeExceeded = (h, view) => {
  return getMaximumFileSizeExceededView({
    h,
    href: UPLOAD_METRIC_ID,
    maximumFileSize: process.env.MAX_METRIC_UPLOAD_MB,
    view: view
  })
}
