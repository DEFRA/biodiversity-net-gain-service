import constants from '../../utils/constants.js'
import { processRegistrationTask } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Legal information',
      title: 'Add legal agreement details'
    }, {
      status: constants.IN_PROGRESS_REGISTRATION_TASK_STATUS,
      inProgressUrl: constants.routes.SCHEME_OF_WORKS_LEGAL_AGREEMENT
    })
    return h.view(constants.views.SCHEME_OF_WORKS_LEGAL_AGREEMENT)
  },
  post: async (request, h) => {
    const { schemeOfWorksLegalAgreement } = request.payload
    if (schemeOfWorksLegalAgreement) {
      request.yar.set(constants.redisKeys.SCHEME_OF_WORKS_LEGAL_AGREEMENT, schemeOfWorksLegalAgreement)
      if (schemeOfWorksLegalAgreement === 'yes-included') {
        return h.redirect(constants.routes.NEED_ADD_ALL_PLANNING_AUTHORITIES)
      } else if (schemeOfWorksLegalAgreement === 'yes-separated') {
        return h.redirect(constants.routes.NEED_LEGAL_AGREEMENT)
      } else if (schemeOfWorksLegalAgreement === 'no') {
        return h.redirect(constants.routes.NEED_ADD_ALL_PLANNING_AUTHORITIES)
      }
    } else {
      return h.view(constants.views.SCHEME_OF_WORKS_LEGAL_AGREEMENT, {
        err: [{
          text: 'Select whether the planning obligation refers to a scheme of works',
          href: '#schemeOfWorksLegalAgreement'
        }]
      })
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.SCHEME_OF_WORKS_LEGAL_AGREEMENT,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.SCHEME_OF_WORKS_LEGAL_AGREEMENT,
  handler: handlers.post
}]
