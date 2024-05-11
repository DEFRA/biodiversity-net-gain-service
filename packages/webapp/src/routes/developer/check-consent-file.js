import constants from '../../utils/constants.js'
import path from 'path'
import { getHumanReadableFileSize } from '../../utils/helpers.js'
import { deleteBlobFromContainers } from '../../utils/azure-storage.js'

const getContext = request => {
  const fileLocation = request.yar.get(constants.redisKeys.DEVELOPER_CONSENT_TO_USE_GAIN_SITE_FILE_LOCATION)
  const fileSize = request.yar.get(constants.redisKeys.DEVELOPER_CONSENT_TO_USE_GAIN_SITE_FILE_SIZE)
  const humanReadableFileSize = getHumanReadableFileSize(fileSize)

  const proofOfPermission = {}
  const isAgent = request.yar.get(constants.redisKeys.DEVELOPER_IS_AGENT) === constants.APPLICANT_IS_AGENT.YES
  const clientIsNotLandownerOrLeaseholder = request.yar.get(constants.redisKeys.DEVELOPER_LANDOWNER_OR_LEASEHOLDER) === constants.DEVELOPER_IS_LANDOWNER_OR_LEASEHOLDER.NO
  if (isAgent && clientIsNotLandownerOrLeaseholder) {
    proofOfPermission.preHeading = 'Proof of permission 2 of 2'
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
    return h.view(constants.views.DEVELOPER_CHECK_CONSENT_TO_USE_GAIN_SITE_FILE, getContext(request))
  },
  post: async (request, h) => {
    const checkConsentToAllocateGains = request.payload.checkConsentToAllocateGains
    const context = getContext(request)
    request.yar.set(constants.redisKeys.DEVELOPER_CONSENT_TO_USE_GAIN_SITE_CHECKED, checkConsentToAllocateGains)
    if (checkConsentToAllocateGains === 'no') {
      await deleteBlobFromContainers(context.fileLocation)
      request.yar.clear(constants.redisKeys.DEVELOPER_CONSENT_TO_USE_GAIN_SITE_FILE_LOCATION)
      return h.redirect(constants.routes.DEVELOPER_UPLOAD_CONSENT_TO_ALLOCATE_GAINS)
    } else if (checkConsentToAllocateGains === 'yes') {
      return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.DEVELOPER_TASKLIST)
    } else {
      context.err = [{
        text: 'Select yes if this is the correct file',
        href: '#check-upload-correct-yes'
      }]
      return h.view(constants.views.DEVELOPER_CHECK_CONSENT_TO_USE_GAIN_SITE_FILE, context)
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_CHECK_CONSENT_TO_USE_GAIN_SITE_FILE,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.DEVELOPER_CHECK_CONSENT_TO_USE_GAIN_SITE_FILE,
  handler: handlers.post
}]
