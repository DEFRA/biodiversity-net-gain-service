import constants from '../../utils/constants.js'
import { getValidReferrerUrl, getHumanReadableFileSize } from '../../utils/helpers.js'
import path from 'path'

const getContext = request => {
  const fileLocation = request.yar.get(constants.cacheKeys.WRITTEN_AUTHORISATION_LOCATION)
  const fileSize = request.yar.get(constants.cacheKeys.WRITTEN_AUTHORISATION_FILE_SIZE)
  const humanReadableFileSize = getHumanReadableFileSize(fileSize)
  return {
    filename: fileLocation === null ? '' : path.parse(fileLocation).base,
    fileSize: humanReadableFileSize,
    fileLocation
  }
}

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.CHECK_WRITTEN_AUTHORISATION_FILE, getContext(request))
  },
  post: async (request, h) => {
    const checkWrittenAuthorisation = request.payload.checkWrittenAuthorisation
    const context = getContext(request)
    request.yar.set(constants.cacheKeys.WRITTEN_AUTHORISATION_CHECKED, checkWrittenAuthorisation)
    if (checkWrittenAuthorisation === 'no') {
      return h.redirect(constants.routes.UPLOAD_WRITTEN_AUTHORISATION)
    } else if (checkWrittenAuthorisation === 'yes') {
      const referrerUrl = getValidReferrerUrl(request.yar, constants.LAND_APPLICANT_INFO_VALID_REFERRERS)
      return h.redirect(referrerUrl || constants.routes.CHECK_APPLICANT_INFORMATION)
    } else {
      context.err = [{
        text: 'Select yes if this is the correct file',
        href: '#check-upload-correct-yes'
      }]
      return h.view(constants.views.CHECK_WRITTEN_AUTHORISATION_FILE, context)
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CHECK_WRITTEN_AUTHORISATION_FILE,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CHECK_WRITTEN_AUTHORISATION_FILE,
  handler: handlers.post
}]
