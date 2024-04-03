import constants from '../../utils/constants.js'
import path from 'path'
import { deleteBlobFromContainers } from '../../utils/azure-storage.js'
import { getHumanReadableFileSize, processDeveloperTask } from '../../utils/helpers.js'

const href = '#check-upload-correct-yes'
const handlers = {
  get: async (request, h) => {
    const context = getContext(request)
    return h.view(constants.views.DEVELOPER_AGREEMENT_CHECK, context)
  },
  post: async (request, h) => {
    const checkUploadConsent = request.payload.checkUploadConsent
    const consentUploadLocation = request.yar.get(constants.cacheKeys.DEVELOPER_CONSENT_FILE_LOCATION)
    request.yar.set(constants.cacheKeys.METRIC_FILE_CHECKED, checkUploadConsent)
    if (checkUploadConsent === constants.CHECK_UPLOAD_METRIC_OPTIONS.NO) {
      await deleteBlobFromContainers(consentUploadLocation)
      request.yar.clear(constants.cacheKeys.DEVELOPER_CONSENT_FILE_LOCATION)
      return h.redirect(constants.routes.DEVELOPER_CONSENT_AGREEMENT_UPLOAD)
    } else if (checkUploadConsent === constants.CHECK_UPLOAD_METRIC_OPTIONS.YES) {
      processDeveloperTask(request,
        {
          taskTitle: 'Consent to use a biodiversity gain site for off-site gain',
          title: 'Upload the consent document'
        }, { status: constants.COMPLETE_DEVELOPER_TASK_STATUS })
      request.yar.set(constants.cacheKeys.DEVELOPER_CONSENT_ANSWER, true)
      return h.redirect(request.yar.get(constants.cacheKeys.REFERER, true) || constants.routes.DEVELOPER_TASKLIST)
    }
    return h.view(constants.views.DEVELOPER_AGREEMENT_CHECK, {
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
  const fileLocation = request.yar.get(constants.cacheKeys.DEVELOPER_CONSENT_FILE_LOCATION)
  const fileSize = request.yar.get(constants.cacheKeys.DEVELOPER_CONSENT_FILE_SIZE)
  const humanReadableFileSize = getHumanReadableFileSize(fileSize)
  return {
    filename: fileLocation === null ? '' : path.parse(fileLocation).base,
    fileSize: humanReadableFileSize,
    yesSelection: request.yar.get(constants.cacheKeys.DEVELOPER_CONSENT_ANSWER)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_AGREEMENT_CHECK,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.DEVELOPER_AGREEMENT_CHECK,
  handler: handlers.post
}]
