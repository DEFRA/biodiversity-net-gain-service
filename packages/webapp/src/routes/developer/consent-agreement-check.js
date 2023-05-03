import constants from '../../utils/constants.js'
import path from 'path'
import { deleteBlobFromContainers } from '../../utils/azure-storage.js'

const href = '#check-upload-correct-yes'
const handlers = {
  get: async (request, h) => {
    const context = getContext(request)
    return h.view(constants.views.DEVELOPER_CONSENT_AGREEMENT_CHECK, context)
  },
  post: async (request, h) => {
    const checkUploadConsent = request.payload.checkUploadConsent
    const consentUploadLocation = request.yar.get(constants.redisKeys.DEVELOPER_CONSENT_FILE_LOCATION)
    request.yar.set(constants.redisKeys.DEVELOPER_CONSENT_FILE_CHECKED, checkUploadConsent)
    if (checkUploadConsent === constants.CHECK_UPLOAD_CONSENT_OPTIONS.NO) {
      await deleteBlobFromContainers(consentUploadLocation)
      request.yar.clear(constants.redisKeys.DEVELOPER_CONSENT_FILE_LOCATION)
      return h.redirect(constants.routes.DEVELOPER_CONSENT_AGREEMENT_UPLOAD)
    } else if (checkUploadConsent === constants.CHECK_UPLOAD_CONSENT_OPTIONS.YES) {
      return h.redirect('/' + constants.views.DEVELOPER_CONFIRM_DEV_DETAILS)
    }
    return h.view(constants.views.DEVELOPER_CONSENT_AGREEMENT_CHECK, {
      filename: path.basename(consentUploadLocation),
      ...getContext(request),
      err: [
        {
          text: 'Select yes if this is the correct file',
          href
        }
      ]
    })
  }
}

const getContext = request => {
  const fileLocation = request.yar.get(constants.redisKeys.DEVELOPER_CONSENT_FILE_LOCATION)
  return {
    filename: fileLocation === null ? '' : path.parse(fileLocation).base,
    fileSize: request.yar.get(constants.redisKeys.DEVELOPER_CONSENT_FILE_SIZE)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_CONSENT_AGREEMENT_CHECK,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.DEVELOPER_CONSENT_AGREEMENT_CHECK,
  handler: handlers.post
}]
