import constants from './constants.js'
import { getMaximumFileSizeExceededView } from './helpers.js'
import { ThreatScreeningError, MalwareDetectedError } from '@defra/bng-errors-lib'

function processErrorUpload (err, h, href) {
  // TODO: delete console.log when you have tested the new function
  console.log('Hello from processErrorUpload, href: ', href)
  switch (err.message) {
    case constants.uploadErrors.emptyFile:
      return buildErrorResponse(h, 'The selected file is empty', href)
    case constants.uploadErrors.noFile:
      return buildErrorResponse(h, 'Select the written authorisation file', href)
    case constants.uploadErrors.unsupportedFileExt:
      return buildErrorResponse(h, 'The selected file must be a DOC, DOCX or PDF', href)
    default:
      if (err instanceof ThreatScreeningError) {
        return buildErrorResponse(h, constants.uploadErrors.malwareScanFailed, href)
      } else if (err instanceof MalwareDetectedError) {
        return buildErrorResponse(h, constants.uploadErrors.threatDetected, href)
      } else {
        return buildErrorResponse(h, constants.uploadErrors.uploadFailure, href)
      }
  }
}

function buildErrorResponse (h, message, href) {
  // TODO: delete console.log when you have tested the new function
  console.log('Hello from buildErrorResponse, message: ', message, 'href: ', href)
  return h.view(href, {
    err: [{
      text: message,
      href
    }]
  })
}

function maximumFileSizeExceeded (h, href, maximumFileSize, view) {
  // TODO: delete console.log when you have tested the new function
  console.log('Hello from maximumFileSizeExceeded')
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
  maximumFileSizeExceeded
}
