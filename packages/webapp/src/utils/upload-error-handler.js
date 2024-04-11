import constants from './constants.js'
import { getMaximumFileSizeExceededView } from './helpers.js'
import { ThreatScreeningError, MalwareDetectedError } from '@defra/bng-errors-lib'

function processErrorUpload (err, h, viewPath, href) {
  // TODO: delete console.log when you have tested the new function
  console.log('Hello from processErrorUpload')
  switch (err.message) {
    case constants.uploadErrors.emptyFile:
      return buildErrorResponse(h, 'The selected file is empty', viewPath, href)
    case constants.uploadErrors.noFile:
      return buildErrorResponse(h, 'Select the written authorisation file', viewPath, href)
    case constants.uploadErrors.unsupportedFileExt:
      return buildErrorResponse(h, 'The selected file must be a DOC, DOCX or PDF', viewPath, href)
    default:
      if (err instanceof ThreatScreeningError) {
        return buildErrorResponse(h, constants.uploadErrors.malwareScanFailed, viewPath, href)
      } else if (err instanceof MalwareDetectedError) {
        return buildErrorResponse(h, constants.uploadErrors.threatDetected, viewPath, href)
      } else {
        return buildErrorResponse(h, constants.uploadErrors.uploadFailure, viewPath, href)
      }
  }
}

function buildErrorResponse (h, message, href) {
  // TODO: delete console.log when you have tested the new function
  console.log('Hello from buildErrorResponse')
  console.log('message: ', message)
  console.log('href: ', href)
  return h.view(href, {
    err: [{
      text: message,
      href
    }]
  })
}

function maximumFileSizeExceededNew (h, href, maximumFileSize, view) {
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
  maximumFileSizeExceededNew
}
