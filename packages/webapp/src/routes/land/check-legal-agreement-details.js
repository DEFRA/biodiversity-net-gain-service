import constants from '../../utils/constants.js'
import path from 'path'
import { processRegistrationTask, getNameAndRoles, dateToString, listArray, getLegalAgreementDocumentType } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Legal information',
      title: 'Add legal agreement details'
    }, {
      inProgressUrl: constants.routes.CHECK_LEGAL_AGREEMENT_DETAILS
    })
    return h.view(constants.views.CHECK_LEGAL_AGREEMENT_DETAILS, {
      dateToString,
      listArray,
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    processRegistrationTask(request, { taskTitle: 'Legal information', title: 'Add legal agreement details' }, { status: constants.COMPLETE_REGISTRATION_TASK_STATUS })
    return h.redirect(constants.routes.REGISTER_LAND_TASK_LIST)
  }
}

const getContext = request => {
  return {
    legalAgreementType: getLegalAgreementDocumentType(request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE)),
    legalAgreementFileName: getLegalAgreementFileName(request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_LOCATION)),
    partyNameAndRole: getNameAndRoles(request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_PARTIES)),
    legalAgreementStartDate: request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_START_DATE_KEY)
  }
}

const getLegalAgreementFileName = fileLocation => fileLocation ? path.parse(fileLocation).base : ''

export default [{
  method: 'GET',
  path: constants.routes.CHECK_LEGAL_AGREEMENT_DETAILS,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CHECK_LEGAL_AGREEMENT_DETAILS,
  handler: handlers.post
}]
