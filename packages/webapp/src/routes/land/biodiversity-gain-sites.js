import constants from '../../utils/constants.js'
import { getContextForRegistrations } from '../../utils/get-context-for-applications-by-type.js'
import getApplicantContext from '../../utils/get-applicant-context.js'

export default {
  method: 'GET',
  path: constants.routes.BIODIVERSITY_GAIN_SITES,
  handler: async (request, h) => {
    const { organisationId } = getApplicantContext(request.auth.credentials.account, request.yar)
    return h.view(constants.views.BIODIVERSITY_GAIN_SITES, {
      ...await getContextForRegistrations(request.auth.credentials.account.idTokenClaims.contactId, organisationId)
    })
  }
}
