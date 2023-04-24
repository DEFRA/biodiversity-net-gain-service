import constants from '../../utils/constants.js'
import applicant from '../../__mock-data__/test-application.json.js'

const seedData = {
  method: 'GET',
  path: constants.routes.TEST_SEED_DATA,
  handler: async (request, h) => {
    request.yar._store = applicant.data
    return h.view(constants.views.TEST_SEED_DATA)
  }
}

export default seedData
