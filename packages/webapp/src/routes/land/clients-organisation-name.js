import constants from '../../utils/constants.js'
import {
  processRegistrationTask
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

    let organisationNameErr

    if (!organisationName) {
      organisationNameErr = [{
        text: 'Enter the organisation name',
        href: 'organisationName'
      }]
    }

    if (organisationName && organisationName.length > 50) {
      organisationNameErr = [{
        text: 'Organisation name must be 50 characters or fewer',
        href: 'organisationName'
      }]
    }

    if (organisationNameErr && organisationNameErr.length > 0) {
      return h.view(constants.views.CLIENTS_ORGANISATION_NAME, {
        err: Object.values(organisationNameErr),
        organisationNameErr
      })
    } else {
      request.yar.set(constants.redisKeys.CLIENTS_ORGANISATION_NAME, organisationName)
      // TODO: update route when 3616 is complete
      return h.redirect('land/isAddressUK')
    }
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
