import constants from '../../utils/constants.js'
import { getContextForCombinedCase } from '../../utils/get-context-for-applications-by-type.js'
import getOrganisationDetails from '../../utils/get-organisation-details.js'

export default {
  method: 'GET',
  path: constants.routes.COMBINED_CASE_PROJECTS,
  handler: async (request, h) => {
    const { currentOrganisationId: organisationId } = getOrganisationDetails(request.auth.credentials.account.idTokenClaims)
    return h.view(constants.views.COMBINED_CASE_PROJECTS, {
      ...await getContextForCombinedCase(request.auth.credentials.account.idTokenClaims.contactId, organisationId)
    })
  }
}
