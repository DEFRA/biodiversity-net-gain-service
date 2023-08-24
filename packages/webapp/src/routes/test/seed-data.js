import constants from '../../utils/constants.js'
import applicant from '../../__mock-data__/test-application.js'

const seedData = {
  method: 'GET',
  path: constants.routes.TEST_SEED_DATA,
  handler: async (request, h) => {
    request.yar._store = JSON.parse(applicant.dataString)
    request.yar.set(constants.redisKeys.CONTACT_ID, '38909e15-00f8-49a1-9ef0-6b0f88216373')
    request.yar.set(constants.redisKeys.APPLICATION_TYPE, constants.applicationTypes.REGISTRATION)
    request.yar.set(constants.redisKeys.SAVE_APPLICATION_SESSION_ON_SIGNOUT, true)
    return h.view(constants.views.TEST_SEED_DATA)
  }
}

export default seedData
