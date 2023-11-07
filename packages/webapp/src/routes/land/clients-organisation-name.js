import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    const organisationName = request.yar.get(constants.redisKeys.CLIENTS_ORGANISATION_NAME)

    return h.view(constants.views.CLIENTS_ORGANISATION_NAME, { organisationName })
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
      return h.redirect(constants.routes.IS_ADDRESS_UK)
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
