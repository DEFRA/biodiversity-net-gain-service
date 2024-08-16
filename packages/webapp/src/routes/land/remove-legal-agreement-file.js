import path from 'path'
import constants from '../../utils/constants.js'
import { validateIdGetSchemaOptional } from '../../utils/helpers.js'
import { deleteBlobFromContainers } from '../../utils/azure-storage.js'

const handlers = {
  get: async (request, h) => {
    const { id } = request.query
    let filenameText
    if (id) {
      const legalAgreementFiles = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_FILES)
      if (legalAgreementFiles.length === 0) {
        return h.redirect(constants.routes.NEED_ADD_ALL_LEGAL_FILES)
      }
      const legalAgreementFile = legalAgreementFiles.find(item => item.id === id)
      filenameText = legalAgreementFile.location === null ? '' : path.parse(legalAgreementFile.location).base
    }
    return h.view(constants.views.REMOVE_LEGAL_AGREEMENT_FILE, {
      filenameText
    })
  },
  post: async (request, h) => {
    const { id } = request.query
    const { legalAgreementFileToRemove } = request.payload
    let filenameText
    let legalAgreementFiles
    let legalAgreementFile
    if (id) {
      legalAgreementFiles = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_FILES)
      legalAgreementFile = legalAgreementFiles.find(item => item.id === id)
      filenameText = legalAgreementFile.location === null ? '' : path.parse(legalAgreementFile.location).base
    }
    if (!legalAgreementFileToRemove) {
      return h.view(constants.views.REMOVE_LEGAL_AGREEMENT_FILE, {
        filenameText,
        err: [{
          text: `Select yes if you want to remove ${filenameText} as a legal agreement file`,
          href: '#legalAgreementFileToRemove'
        }]
      })
    }
    let updatedLegalAgreementFiles
    const isCombinedCase = (request?._route?.path || '').startsWith('/combined-case')
    if (legalAgreementFileToRemove === 'yes') {
      await deleteBlobFromContainers(legalAgreementFile.location)
      updatedLegalAgreementFiles = legalAgreementFiles.filter(item => item.id !== id)
      request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_FILES, updatedLegalAgreementFiles)
      if (updatedLegalAgreementFiles.length === 0) { return h.redirect(isCombinedCase ? constants.reusedRoutes.COMBINED_CASE_NEED_ADD_ALL_LEGAL_FILES : constants.routes.NEED_ADD_ALL_LEGAL_FILES) }
    }
    return h.redirect(isCombinedCase ? constants.reusedRoutes.COMBINED_CASE_CHECK_LEGAL_AGREEMENT_FILES : constants.routes.CHECK_LEGAL_AGREEMENT_FILES)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.REMOVE_LEGAL_AGREEMENT_FILE,
  handler: handlers.get,
  options: validateIdGetSchemaOptional
}, {
  method: 'POST',
  path: constants.routes.REMOVE_LEGAL_AGREEMENT_FILE,
  handler: handlers.post,
  options: validateIdGetSchemaOptional
}]
