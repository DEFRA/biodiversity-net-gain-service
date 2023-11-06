import constants from '../../utils/constants.js'
// import { processRegistrationTask } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    // processRegistrationTask(request, {
    //   taskTitle: 'Applicant information',
    //   title: 'Add details about the applicant'
    // }, {
    //   inProgressUrl: constants.routes.CLIENT_INDIVIDUAL_ORGANISATION
    // })

    return h.view(constants.views.CLIENT_INDIVIDUAL_ORGANISATION)
  },
  post: async (request, h) => {
    const { landownerType } = request.payload

    if (!landownerType) {
      return h.view(constants.views.CLIENT_INDIVIDUAL_ORGANISATION, {
        err: [{
          text: 'Select if your client is an individual or organisation',
          href: '#landownerType'
        }]
      })
    }
    request.yar.set(constants.redisKeys.CLIENTS_ORGANISATION_NAME, landownerType)

    if (landownerType === constants.landownerTypes.INDIVIDUAL) {
      return h.redirect(constants.routes.CLIENTS_NAME)
    } else {
      return h.redirect(constants.routes.CLIENTS_ORGANISATION_NAME)
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CLIENT_INDIVIDUAL_ORGANISATION,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CLIENT_INDIVIDUAL_ORGANISATION,
  handler: handlers.post
}]
