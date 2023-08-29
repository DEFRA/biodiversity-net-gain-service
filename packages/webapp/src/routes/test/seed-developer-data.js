import constants from '../../utils/constants.js'
import applicant from '../../__mock-data__/test-developer-application.js'

const seedData = {
  method: 'GET',
  path: constants.routes.TEST_DEVELOPER_SEED_DATA,
  handler: async (request, h) => {
    request.yar._store = JSON.parse(applicant.data)
    return h.view(constants.views.TEST_DEVELOPER_SEED_DATA)
  }
}

export default seedData
