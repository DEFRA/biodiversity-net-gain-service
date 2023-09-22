import constants from '../../utils/constants.js'
import { processRegistrationTask } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Legal information',
      title: 'Habitat Legal Agreement'
    }, {
      inProgressUrl: constants.routes.HABITAT_PLAN_LEGAL_AGREEMENT
    })

    return h.view(constants.views.HABITAT_PLAN_LEGAL_AGREEMENT)
  },
  post: async (request, h) => {
    const { isHabitatIncludeLegalAgreement } = request.payload

    if (!isHabitatIncludeLegalAgreement) {
      return h.view(constants.views.HABITAT_PLAN_LEGAL_AGREEMENT, {

        routes: constants.routes,
        err: [{
          text: 'Select yes if the habitat management and monitoring plan',
          href: '#isHabitatIncludeLegalAgreement'
        }]
      })
    }

    if (isHabitatIncludeLegalAgreement === 'yes') {
      return h.redirect(constants.routes.ENHANCEMENT_WORKS_START_DATE)
    }

    return h.redirect(constants.routes.UPLOAD_HABITAT_PLAN)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.HABITAT_PLAN_LEGAL_AGREEMENT,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.HABITAT_PLAN_LEGAL_AGREEMENT,
  handler: handlers.post
}]
