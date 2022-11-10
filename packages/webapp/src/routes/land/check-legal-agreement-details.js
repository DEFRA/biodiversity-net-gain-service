import constants from '../../utils/constants.js'
import path from 'path'
import { processCompletedRegistrationTask, getNameAndRoles, dateToString, listArray } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.LEGAL_AGREEMENT_SUMMARY, {
      dateToString,
      listArray,
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    processCompletedRegistrationTask(request, { taskTitle: 'Legal information', title: 'Add legal agreement details' })
    return h.redirect(constants.routes.REGISTER_LAND_TASK_LIST)
  }
}

const getContext = request => {
  return {
    legalAgreementType: request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE),
    legalAgreementFileName: getLegalAgreementFileName(request),
    partyNameAndRole: getNameAndRoles(request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_PARTIES)),
    legalAgreementStartDate: request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_START_DATE_KEY)
  }
}

const getLegalAgreementFileName = request => {
  const fileLocation = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_LOCATION)
  return fileLocation ? path.parse(fileLocation).base : ''
}

export default [{
  method: 'GET',
  path: constants.routes.LEGAL_AGREEMENT_SUMMARY,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.LEGAL_AGREEMENT_SUMMARY,
  handler: handlers.post
}]
