import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    const isIndividualOrOrganisation = request.yar.get(constants.redisKeys.DEVELOPER_CLIENT_INDIVIDUAL_ORGANISATION)
    const clientsName = request.yar.get(constants.redisKeys.DEVELOPER_CLIENTS_NAME)
    const clientsOrganisationName = request.yar.get(constants.redisKeys.DEVELOPER_CLIENTS_ORGANISATION_NAME)
    const isIndividual = isIndividualOrOrganisation === constants.individualOrOrganisationTypes.INDIVIDUAL

    const context = {
      isIndividual,
      clientsName,
      clientsOrganisationName
    }
    return h.view(constants.views.DEVELOPER_NEED_ADD_PERMISSION, context)
  },
  post: async (request, h) => {
    return h.redirect(constants.routes.DEVELOPER_UPLOAD_WRITTEN_AUTHORISATION)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_NEED_ADD_PERMISSION,
  handler: handlers.get
},
{
  method: 'POST',
  path: constants.routes.DEVELOPER_NEED_ADD_PERMISSION,
  handler: handlers.post
}]
