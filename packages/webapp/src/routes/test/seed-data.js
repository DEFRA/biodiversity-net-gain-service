import constants from '../../utils/constants.js'
import applicant from '../../__mock-data__/test-application.js'

const seedData = {
  method: 'GET',
  path: constants.routes.TEST_SEED_DATA,
  handler: async (request, h) => {
    request.yar._store = JSON.parse(applicant.dataString)
    request.yar.set(constants.redisKeys.CONTACT_ID, request.auth.credentials.account.idTokenClaims.contactId)
    request.yar.set(constants.redisKeys.APPLICATION_TYPE, constants.applicationTypes.REGISTRATION)
    request.yar.set(constants.redisKeys.SAVE_APPLICATION_SESSION_ON_SIGNOUT_OR_JOURNEY_CHANGE, true)
    return h.view(constants.views.TEST_SEED_DATA)
  }
}

export default seedData
