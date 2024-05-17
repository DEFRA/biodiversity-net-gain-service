import constants from '../../utils/constants.js'
import applicationInformationContext from './helpers/applicant-information.js'
import { REGISTRATIONCONSTANTS } from '../../journey-validation/registration/task-sections.js'
import { getIndividualTaskStatus } from '../../journey-validation/task-list-generator.js'
import { getRegistrationOrCombinedTaskListUrl } from '../../utils/helpers.js'
const handlers = {
  get: async (request, h) => {
    const registrationTaskStatus = getIndividualTaskStatus(request.yar, REGISTRATIONCONSTANTS.APPLICANT_INFO)
    if (registrationTaskStatus !== 'COMPLETED') {
      return h.redirect(getRegistrationOrCombinedTaskListUrl(request.yar))
    }
    return h.view(constants.views.CHECK_APPLICANT_INFORMATION, applicationInformationContext(request.yar))
  },
  post: async (request, h) => {
    return h.redirect(getRegistrationOrCombinedTaskListUrl(request.yar))
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
