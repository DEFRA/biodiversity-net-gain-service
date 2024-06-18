import constants from './constants.js'
import { getMaximumFileSizeExceededView } from './helpers.js'
import { ThreatScreeningError, MalwareDetectedError } from '@defra/bng-errors-lib'

function processErrorUpload ({ err, h, route, elementID, noFileErrorMessage, unsupportedFileExtErrorMessage, optionalErrorMessage = 'default', maximumFileSize }) {
  switch (err.message) {
    case constants.uploadErrors.maximumFileSizeExceeded:
      return buildErrorResponse(h, `The selected file must not be larger than ${maximumFileSize}MB`, route, elementID)
    case constants.uploadErrors.emptyFile:
      return buildErrorResponse(h, 'The selected file is empty', route, elementID)
    case constants.uploadErrors.noFile:
      return buildErrorResponse(h, noFileErrorMessage, route, elementID)
    case constants.uploadErrors.unsupportedFileExt:
      return buildErrorResponseWithTwoMessages(h, unsupportedFileExtErrorMessage || 'The selected file must be a DOC, DOCX or PDF', optionalErrorMessage, route, elementID)
    case constants.uploadErrors.notValidMetric:
      return buildErrorResponse(h, 'The selected file is not a valid Metric', route, elementID)
    default:
      if (err instanceof ThreatScreeningError) {
        return buildErrorResponse(h, constants.uploadErrors.malwareScanFailed, route, elementID)
      } else if (err instanceof MalwareDetectedError) {
        return buildErrorResponse(h, constants.uploadErrors.threatDetected, route, elementID)
      } else {
        return buildErrorResponseWithTwoMessages(h, constants.uploadErrors.uploadFailure, optionalErrorMessage, route, elementID)
      }
  }
}

function buildErrorResponse (h, message, route, elementID) {
  return h.view(route, {
    err: [{
      text: message,
      href: elementID
    }]
  })
}

function buildErrorResponseWithTwoMessages (h, message, message2 = 'default', route, elementID) {
  if (message2 === 'default') {
    return h.view(route, {
      err: [{
        text: message,
        href: elementID

      }]
    })
  } else {
    return h.view(route, {
      err: [{
        text: message2,
        href: elementID

      }, {
        text: message,
        href: elementID
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
