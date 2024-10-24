import path from 'path'
import constants from '../../utils/constants.js'
import {
  getHumanReadableFileSize,
  getLegalAgreementDocumentType, validateIdGetSchemaOptional
} from '../../utils/helpers.js'
import { deleteBlobFromContainers } from '../../utils/azure-storage.js'
import { getNextStep } from '../../journey-validation/task-list-generator.js'

const handlers = {
  get: async (request, h) => {
    const legalAgreementFiles = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_FILES)
    if (legalAgreementFiles.length === 0) {
      return h.redirect(constants.routes.NEED_ADD_ALL_LEGAL_FILES)
    }
    return h.view(constants.views.CHECK_LEGAL_AGREEMENT, getContext(request))
  },
  post: async (request, h) => {
    const checkLegalAgreement = request.payload.checkLegalAgreement
    const context = getContext(request)
    request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_CHECKED, checkLegalAgreement)
    if (checkLegalAgreement === 'no') {
      const { id } = request.query
      const legalAgreementFiles = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_FILES)
      await deleteBlobFromContainers(context.fileLocation)
      const updatedLegalAgreementFiles = legalAgreementFiles.filter(item => item.id !== id)
      request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_FILES, updatedLegalAgreementFiles)
      request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_FILE_OPTION, 'no')
      return getNextStep(request, h)
    } else if (checkLegalAgreement === 'yes') {
      request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_FILE_OPTION, 'yes')
      return getNextStep(request, h)
    } else {
      context.err = [{
        text: 'Select yes if this is the correct file',
        href: '#check-upload-correct-yes'
      }]
      return h.view(constants.views.CHECK_LEGAL_AGREEMENT, context)
    }
  }
}

const getContext = (request) => {
  const { id } = request.query
  let legalAgreementFile
  let fileLocation = ''
  let filename = ''
  let fileSize = null
  let humanReadableFileSize = ''
  const legalAgreementFiles = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_FILES)
  const legalAgreementType = getLegalAgreementDocumentType(
    request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()
  if (id) {
    legalAgreementFile = legalAgreementFiles.find(item => item.id === id)
    fileLocation = legalAgreementFile.location
    filename = fileLocation === null ? '' : path.parse(fileLocation).base
    fileSize = legalAgreementFile.fileSize
    humanReadableFileSize = getHumanReadableFileSize(fileSize)
  }
  return {
    filename,
    selectedOption: request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_FILE_OPTION),
    fileSize: humanReadableFileSize,
    legalAgreementType,
    fileLocation,
    fileId: id
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CHECK_LEGAL_AGREEMENT,
  handler: handlers.get,
  options: validateIdGetSchemaOptional
}, {
  method: 'POST',
  path: constants.routes.CHECK_LEGAL_AGREEMENT,
  handler: handlers.post,
  options: validateIdGetSchemaOptional
}]
