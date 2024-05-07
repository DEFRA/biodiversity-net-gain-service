import constants from '../../utils/constants.js'
import applicant from '../../__mock-data__/test-application.js'
import getOrganisationDetails from '../../utils/get-organisation-details.js'

const seedData = {
  method: 'GET',
  path: constants.routes.TEST_SEED_DATA,
  handler: async (request, h) => {
    request.yar._store = JSON.parse(applicant.dataString)
    const { currentOrganisationId: organisationId } = getOrganisationDetails(request.auth.credentials.account.idTokenClaims)
    request.yar.set(constants.cacheKeys.CONTACT_ID, request.auth.credentials.account.idTokenClaims.contactId)
    request.yar.set(constants.cacheKeys.ORGANISATION_ID, organisationId)
    request.yar.set(constants.cacheKeys.APPLICATION_TYPE, constants.applicationTypes.REGISTRATION)
    request.yar.set(constants.cacheKeys.SAVE_APPLICATION_SESSION_ON_SIGNOUT_OR_JOURNEY_CHANGE, true)
    request.yar.set(constants.cacheKeys.SAVE_APPLICATION_SESSION_ON_SIGNOUT, true)
    return h.view(constants.views.TEST_SEED_DATA)
  }
}

export default seedData
