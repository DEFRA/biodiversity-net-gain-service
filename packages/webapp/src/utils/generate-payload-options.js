import { getMaximumFileSizeExceededView } from './helpers.js'
import constants from './constants.js'

export function generatePayloadOptions ({ fileId, legalAgreementType }, maximumFileSize, view) {
  return {
    payload: {
      maxBytes: (parseInt(maximumFileSize) + 1) * 1024 * 1024,
      multipart: true,
      timeout: false,
      output: 'stream',
      parse: false,
      allow: 'multipart/form-data',
      failAction: (request, h, err) => {
        console.log('File upload too large', request.path)
        if (err.output.statusCode === 413) { // Request entity too large
          return maximumFileSizeExceeded(h, { fileId, legalAgreementType }, maximumFileSize, view).takeover()
        } else {
          throw err
        }
      }
    }
  }
}

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
