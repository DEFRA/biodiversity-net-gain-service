import constants from '../../utils/constants.js'
import applicant from '../../__mock-data__/test-application.js'

const seedData = {
  method: 'GET',
  path: constants.routes.TEST_SEED_DATA,
  handler: async (request, h) => {
    request.yar._store = JSON.parse(applicant.dataString)
    return h.view(constants.views.TEST_SEED_DATA)
  }
}

export default seedData
