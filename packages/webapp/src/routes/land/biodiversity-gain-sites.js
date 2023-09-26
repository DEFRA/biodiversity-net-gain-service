import constants from '../../utils/constants.js'
import { getContextForRegistrations } from '../../utils/get-context-for-applications-by-type.js'

export default {
  method: 'GET',
  path: constants.routes.BIODIVERSITY_GAIN_SITES,
  handler: async (request, h) => h.view(constants.views.BIODIVERSITY_GAIN_SITES, {
    ...await getContextForRegistrations(request.auth.credentials.account.idTokenClaims.contactId)
  })
}
