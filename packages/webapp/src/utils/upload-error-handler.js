import constants from './constants.js'
import { getMaximumFileSizeExceededView } from './helpers.js'
import { ThreatScreeningError, MalwareDetectedError } from '@defra/bng-errors-lib'

function processErrorUpload ({ err, h, href, noFileErrorMessage, unsupportedFileExtErrorMessage, optionalErrorMessage = 'default', maximumFileSize }) {
  switch (err.message) {
    case constants.uploadErrors.maximumFileSizeExceeded:
      return buildErrorResponse(h, `The selected file must not be larger than ${maximumFileSize}MB`, href)
    case constants.uploadErrors.emptyFile:
      return buildErrorResponse(h, 'The selected file is empty', href)
    case constants.uploadErrors.noFile:
      return buildErrorResponse(h, noFileErrorMessage, href)
    case constants.uploadErrors.unsupportedFileExt:
      return buildErrorResponseWithTwoMessages(h, unsupportedFileExtErrorMessage || 'The selected file must be a DOC, DOCX or PDF', optionalErrorMessage, href)
    case constants.uploadErrors.notValidMetric:
      return buildErrorResponse(h, 'The selected file is not a valid Metric', href)
    default:
      if (err instanceof ThreatScreeningError) {
        return buildErrorResponse(h, constants.uploadErrors.malwareScanFailed, href)
      } else if (err instanceof MalwareDetectedError) {
        return buildErrorResponse(h, constants.uploadErrors.threatDetected, href)
      } else {
        return buildErrorResponseWithTwoMessages(h, constants.uploadErrors.uploadFailure, optionalErrorMessage, href)
      }
  }
}

function buildErrorResponse (h, message, href) {
  return h.view(href, {
    err: [{
      text: message,
      href
    }]
  })
}

function buildErrorResponseWithTwoMessages (h, message, message2 = 'default', href) {
  if (message2 === 'default') {
    return h.view(href, {
      err: [{
        text: message,
        href
      }]
    })
  } else {
    return h.view(href, {
      err: [{
        text: message2,
        href
      }, {
        text: message,
        href
      }]
    })
  }
}

function maximumFileSizeExceeded (h, href, maximumFileSize, view) {
  return getMaximumFileSizeExceededView({
    h,
    href,
    maximumFileSize,
    view
  })
}

export {
  processErrorUpload,
  buildErrorResponse,
  buildErrorResponseWithTwoMessages,
  maximumFileSizeExceeded
}
