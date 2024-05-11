import constants from '../../utils/constants.js'
import path from 'path'
import { getHumanReadableFileSize } from '../../utils/helpers.js'
import { deleteBlobFromContainers } from '../../utils/azure-storage.js'

const getContext = request => {
  const fileLocation = request.yar.get(constants.redisKeys.DEVELOPER_WRITTEN_AUTHORISATION_LOCATION)
  const fileSize = request.yar.get(constants.redisKeys.DEVELOPER_WRITTEN_AUTHORISATION_FILE_SIZE)
  const humanReadableFileSize = getHumanReadableFileSize(fileSize)

  const proofOfPermission = {}
  const isAgent = request.yar.get(constants.redisKeys.DEVELOPER_IS_AGENT) === constants.APPLICANT_IS_AGENT.YES
  const clientIsNotLandownerOrLeaseholder = request.yar.get(constants.redisKeys.DEVELOPER_LANDOWNER_OR_LEASEHOLDER) === constants.DEVELOPER_IS_LANDOWNER_OR_LEASEHOLDER.NO
  if (isAgent && clientIsNotLandownerOrLeaseholder) {
    proofOfPermission.preHeading = 'Proof of permission 1 of 2'
  }

  return {
    ...proofOfPermission,
    filename: fileLocation === null ? '' : path.parse(fileLocation).base,
    fileSize: humanReadableFileSize,
    fileLocation
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
    if (checkWrittenAuthorisation === 'no') {
      await deleteBlobFromContainers(context.fileLocation)
      request.yar.clear(constants.redisKeys.DEVELOPER_WRITTEN_AUTHORISATION_LOCATION)
      return h.redirect(constants.routes.DEVELOPER_UPLOAD_WRITTEN_AUTHORISATION)
    } else if (checkWrittenAuthorisation === 'yes') {
      const nextRoute = request.yar.get(constants.redisKeys.DEVELOPER_LANDOWNER_OR_LEASEHOLDER) === constants.DEVELOPER_IS_LANDOWNER_OR_LEASEHOLDER.YES
        ? constants.routes.DEVELOPER_TASKLIST
        : constants.routes.DEVELOPER_UPLOAD_CONSENT_TO_ALLOCATE_GAINS
      return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || nextRoute)
    } else {
      context.err = [{
        text: 'Select yes if this is the correct file',
        href: '#check-upload-correct-yes'
      }]
      return h.view(constants.views.DEVELOPER_CHECK_WRITTEN_AUTHORISATION_FILE, context)
    }
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
