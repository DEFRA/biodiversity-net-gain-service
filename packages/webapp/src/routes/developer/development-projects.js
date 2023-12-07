import constants from '../../utils/constants.js'
import { getContextForAllocations } from '../../utils/get-context-for-applications-by-type.js'
import getOrganisationDetails from '../../utils/get-organisation-details.js'

export default {
  method: 'GET',
  path: constants.routes.DEVELOPER_DEVELOPMENT_PROJECTS,
  handler: async (request, h) => {
    const { currentOrganisationId: organisationId } = getOrganisationDetails(request.auth.credentials.account.idTokenClaims)
    return h.view(constants.views.DEVELOPER_DEVELOPMENT_PROJECTS, {
      ...await getContextForAllocations(request.auth.credentials.account.idTokenClaims.contactId, organisationId)
    })
  }
}
