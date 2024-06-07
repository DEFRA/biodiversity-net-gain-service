import constants from '../../utils/constants.js'
import { redirectDeveloperClient } from '../../utils/helpers.js'
import { addRedirectViewUsed } from '../../utils/redirect-view-handler.js'

const handlers = {
  get: async (request, h) => {
    const organisationName = request.yar.get(constants.redisKeys.DEVELOPER_CLIENTS_ORGANISATION_NAME)
    return h.view(constants.views.DEVELOPER_CLIENTS_ORGANISATION_NAME, { organisationName })
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
      return h.redirectView(constants.views.DEVELOPER_CLIENTS_ORGANISATION_NAME, {
        err: Object.values(organisationNameErr),
        organisationNameErr
      })
    } else {
      request.yar.set(constants.redisKeys.DEVELOPER_CLIENTS_ORGANISATION_NAME, organisationName)
      return redirectDeveloperClient(h, request.yar)
    }
  }
}
export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_CLIENTS_ORGANISATION_NAME,
  handler: addRedirectViewUsed(handlers.get)
}, {
  method: 'POST',
  path: constants.routes.DEVELOPER_CLIENTS_ORGANISATION_NAME,
  handler: addRedirectViewUsed(handlers.post)
}]
