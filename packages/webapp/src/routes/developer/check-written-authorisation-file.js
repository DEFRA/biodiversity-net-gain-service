import constants from '../../utils/constants.js'
import path from 'path'
import { getHumanReadableFileSize, isAgentAndNotLandowner } from '../../utils/helpers.js'
import { deleteBlobFromContainers } from '../../utils/azure-storage.js'

const getContext = request => {
  const fileLocation = request.yar.get(constants.redisKeys.DEVELOPER_WRITTEN_AUTHORISATION_LOCATION)

  return {
    fileLocation,
    filename: fileLocation === null ? '' : path.parse(fileLocation).base,
    fileSize: getHumanReadableFileSize(request.yar.get(constants.redisKeys.DEVELOPER_WRITTEN_AUTHORISATION_FILE_SIZE)),
    ...(isAgentAndNotLandowner(request.yar) ? { preHeading: 'Proof of permission 1 of 2' } : {})
  }
}

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.DEVELOPER_CHECK_WRITTEN_AUTHORISATION_FILE, getContext(request))
  },
  post: async (request, h) => {
    const checkWrittenAuthorisation = request.payload.checkWrittenAuthorisation
    const context = getContext(request)
    request.yar.set(constants.redisKeys.DEVELOPER_WRITTEN_AUTHORISATION_CHECKED, checkWrittenAuthorisation)

    if (checkWrittenAuthorisation !== 'yes' && checkWrittenAuthorisation !== 'no') {
      context.err = [{
        text: 'Select yes if this is the correct file',
        href: '#check-upload-correct-yes'
      }]
      return h.view(constants.views.DEVELOPER_CHECK_WRITTEN_AUTHORISATION_FILE, context)
    }

    if (checkWrittenAuthorisation === 'no') {
      await deleteBlobFromContainers(context.fileLocation)
      request.yar.clear(constants.redisKeys.DEVELOPER_WRITTEN_AUTHORISATION_LOCATION)
      return h.redirect(constants.routes.DEVELOPER_UPLOAD_WRITTEN_AUTHORISATION)
    }

    const referrer = request.yar.get(constants.redisKeys.REFERER, true)
    const journeyEntryPoint = request.yar.get(constants.redisKeys.CHECK_AND_SUBMIT_JOURNEY_ROUTE) || constants.routes.DEVELOPER_TASKLIST
    const nextRoute = request.yar.get(constants.redisKeys.DEVELOPER_LANDOWNER_OR_LEASEHOLDER) === constants.DEVELOPER_IS_LANDOWNER_OR_LEASEHOLDER.YES
      ? journeyEntryPoint
      : constants.routes.DEVELOPER_UPLOAD_CONSENT_TO_ALLOCATE_GAINS

    return h.redirect(referrer || nextRoute)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_CHECK_WRITTEN_AUTHORISATION_FILE,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.DEVELOPER_CHECK_WRITTEN_AUTHORISATION_FILE,
  handler: handlers.post
}]
