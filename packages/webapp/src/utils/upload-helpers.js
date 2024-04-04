import { getMaximumFileSizeExceededView } from './helpers.js'
import constants from './constants.js'

const maximumFileSizeExceeded = (h, { fileId, legalAgreementType }, maximumFileSize, view) => {
  // For file uploads
  if (fileId) {
    return getMaximumFileSizeExceededView({
      h,
      href: { fileId },
      maximumFileSize,
      view
    })
    // For legal agreement
  } else if (legalAgreementType) {
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

export { maximumFileSizeExceeded }
