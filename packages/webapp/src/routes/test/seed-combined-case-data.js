import constants from '../../utils/constants.js'
import applicant from '../../__mock-data__/test-application.js'
import getOrganisationDetails from '../../utils/get-organisation-details.js'

const seedData = {
  method: 'GET',
  path: constants.routes.TEST_COMBINED_CASE_DATA,
  handler: async (request, h) => {
    request.yar._store = JSON.parse(applicant.dataString)
    const { currentOrganisationId: organisationId } = getOrganisationDetails(request.auth.credentials.account.idTokenClaims)
    request.yar.set(constants.redisKeys.CONTACT_ID, request.auth.credentials.account.idTokenClaims.contactId)
    request.yar.set(constants.redisKeys.ORGANISATION_ID, organisationId)
    request.yar.set(constants.redisKeys.APPLICATION_TYPE, constants.applicationTypes.COMBINED_CASE)
    request.yar.set(constants.redisKeys.SAVE_APPLICATION_SESSION_ON_SIGNOUT_OR_JOURNEY_CHANGE, true)
    request.yar.set(constants.redisKeys.SAVE_APPLICATION_SESSION_ON_SIGNOUT, true)
    return h.view(constants.views.TEST_COMBINED_CASE_DATA)
  }
}

export default seedData
