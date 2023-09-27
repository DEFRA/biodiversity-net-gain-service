import constants from '../../utils/constants.js'
import path from 'path'
import {
  getHumanReadableFileSize,
  processRegistrationTask,
  getLegalAgreementDocumentType
} from '../../utils/helpers.js'
import { deleteBlobFromContainers } from '../../utils/azure-storage.js'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Legal information',
      title: 'Add legal agreement details'
    }, {
      inProgressUrl: constants.routes.CHECK_LEGAL_AGREEMENT
    })
    return h.view(constants.views.CHECK_LEGAL_AGREEMENT, getContext(request))
  },
  post: async (request, h) => {
    const checkLegalAgreement = request.payload.checkLegalAgreement
    const legalAgreementType = getLegalAgreementDocumentType(request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))
    const context = getContext(request)
    request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_CHECKED, checkLegalAgreement)
    if (checkLegalAgreement === 'no') {
      await deleteBlobFromContainers(context.fileLocation)
      request.yar.clear(constants.redisKeys.LEGAL_AGREEMENT_LOCATION)
      request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_FILE_OPTION, 'no')
      return h.redirect(constants.routes.UPLOAD_LEGAL_AGREEMENT)
    } else if (checkLegalAgreement === 'yes') {
      if (legalAgreementType === constants.LEGAL_AGREEMENT_TYPE_CONSERVATION) { return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.NEED_ADD_ALL_RESPONSIBLE_BODIES) } else {
        return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.ADD_LEGAL_AGREEMENT_PARTIES)
      }
    } else {
      context.err = [{
        text: 'Select yes if this is the correct file',
        href: '#check-upload-correct-yes'
      }]
      return h.view(constants.views.CHECK_LEGAL_AGREEMENT, context)
    }
  }
}

const getContext = request => {
  const fileLocation = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_LOCATION)
  const fileSize = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_FILE_SIZE)
  const humanReadableFileSize = getHumanReadableFileSize(fileSize)
  const legalAgreementType = getLegalAgreementDocumentType(
    request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()

  return {
    filename: fileLocation === null ? '' : path.parse(fileLocation).base,
    selectedOption: request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_FILE_OPTION),
    fileSize: humanReadableFileSize,
    legalAgreementType,
    fileLocation
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CHECK_LEGAL_AGREEMENT,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CHECK_LEGAL_AGREEMENT,
  handler: handlers.post
}]
