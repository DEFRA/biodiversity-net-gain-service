import constants from '../../utils/constants.js'
import applicationInformationContext from './helpers/applicant-information.js'
import { REGISTRATIONCONSTANTS } from '../../journey-validation/registration/task-sections.js'
import { getIndividualTaskStatus, getNextStep } from '../../journey-validation/task-list-generator.js'
const handlers = {
  get: async (request, h) => {
    const registrationTaskStatus = getIndividualTaskStatus(request.yar, REGISTRATIONCONSTANTS.APPLICANT_INFO)
    const isCombinedCase = (request?._route?.path || '').startsWith('/combined-case')
    if (registrationTaskStatus !== 'COMPLETED') {
      if (isCombinedCase) {
        return h.redirect(constants.routes.COMBINED_CASE_TASK_LIST)
      } else {
        return h.redirect(constants.routes.REGISTER_LAND_TASK_LIST)
      }
    }
    return h.view(constants.views.CHECK_APPLICANT_INFORMATION, applicationInformationContext(request.yar))
  },
  post: async (request, h) => {
    return getNextStep(request, h)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CHECK_APPLICANT_INFORMATION,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CHECK_APPLICANT_INFORMATION,
  handler: handlers.post
}]
