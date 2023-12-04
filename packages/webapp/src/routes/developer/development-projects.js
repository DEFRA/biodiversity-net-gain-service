import constants from '../../utils/constants.js'
import { getContextForAllocations } from '../../utils/get-context-for-applications-by-type.js'
import getApplicantContext from '../../utils/get-applicant-context.js'

export default {
  method: 'GET',
  path: constants.routes.DEVELOPER_DEVELOPMENT_PROJECTS,
  handler: async (request, h) => {
    const { organisationId } = getApplicantContext(request.auth.credentials.account, request.yar)
    return h.view(constants.views.DEVELOPER_DEVELOPMENT_PROJECTS, {
      ...await getContextForAllocations(request.auth.credentials.account.idTokenClaims.contactId, organisationId)
    })
  }
}
