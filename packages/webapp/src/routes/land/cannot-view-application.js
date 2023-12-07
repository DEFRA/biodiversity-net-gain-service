import constants from '../../utils/constants.js'
import getOrganisationDetails from '../../utils/get-organisation-details.js'

export default [{
  method: 'GET',
  path: constants.routes.CANNOT_VIEW_APPLICATION,
  handler: (request, h) => {
    const { currentOrganisationId: organisationId } = getOrganisationDetails(request.auth.credentials.account.idTokenClaims)
    const sessionOrganisationId = request.yar.get(constants.redisKeys.ORGANISATION_ID) || undefined
    return h.view(constants.views.CANNOT_VIEW_APPLICATION, {
      organisationIdError: organisationId !== sessionOrganisationId
    })
  }
}]
