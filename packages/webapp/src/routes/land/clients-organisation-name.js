import constants from '../../utils/constants.js'
import {
  processRegistrationTask,
  getLegalAgreementDocumentType
} from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Applicant information',
      title: 'Add details about the applicant'
    }, {
      inProgressUrl: constants.routes.CLIENTS_ORGANISATION_NAME
    })

    return h.view(constants.views.CLIENTS_ORGANISATION_NAME)
  },
  post: async (request, h) => {
    const { organisationName } = request.payload

    if (!organisationName) {
      const organisationNameErr = [{
        text: 'Organisation name must be 2 characters or more',
        href: 'organisationName'
      }]

      return h.view(constants.views.CLIENTS_ORGANISATION_NAME, {
        err: Object.values(organisationNameErr),
        organisationNameErr
      })
    }

    return h.redirect(constants.routes.CLIENTS_ORGANISATION_NAME)
  }
}
export default [{
  method: 'GET',
  path: constants.routes.CLIENTS_ORGANISATION_NAME,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CLIENTS_ORGANISATION_NAME,
  handler: handlers.post
}]
