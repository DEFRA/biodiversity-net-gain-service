import { getMaximumFileSizeExceededView } from './helpers.js'
import constants from './constants.js'
import { processErrorUpload, maximumFileSizeExceededNew } from './upload-error-handler.js'

function generatePayloadOptions (href, maximumFileSize, view) {
  // TODO: delete console.log when you have tested the new function
  console.log('Hello from generatePayloadOptions, ', 'href: ' + href, 'maxFileSize: ' + maximumFileSize, 'view: ' + view)
  return {
    payload: {
      maxBytes: (parseInt(maximumFileSize) + 1) * 1024 * 1024,
      multipart: true,
      timeout: false,
      output: 'stream',
      parse: false,
      allow: 'multipart/form-data',
      failAction: (request, h, err) => {
        console.log('Hello from failAction')
        // TODO: can i eventually get this first if statement moved into the upload-error-handler.js file?
        // For some reason it doesn't return the correct error when i try to move it
        if (err.output.statusCode === 413) { // Request entity too large
          console.log('Hello from failAction: statusCode 413 Request entity too large')
          return maximumFileSizeExceededNew(h, href, maximumFileSize, view).takeover()
        } else if (err) {
          // will this ever be hit? I don't think so... can we ensure that we forward to processErrorUpload
          // in the upload-error-handler.js file instead and handle the file size error there?
          console.log('Hello from failAction: err')
          return processErrorUpload(err, h, href, maximumFileSize, view).takeover()
        } else {
          throw err
        }
      }
    }
  }
}

export { generatePayloadOptions }
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// TODO: this needs to be deleted eventually once you have switched all of the references to the new function
export const maximumFileSizeExceeded = (h, { fileId, legalAgreementType }, maximumFileSize, view) => {
  // For file uploads
  if (fileId) {
    return getMaximumFileSizeExceededView({
      h,
      href: { fileId },
      maximumFileSize,
      view
    })
    // For legal agreement
  } else {
    const legalAgreementId = '#legalAgreement'
    return h.view(constants.views.UPLOAD_LEGAL_AGREEMENT, {
      legalAgreementType,
      err: [{
        text: `The selected file must not be larger than ${maximumFileSize}MB`,
        href: legalAgreementId
      }]
    })
  }
}
