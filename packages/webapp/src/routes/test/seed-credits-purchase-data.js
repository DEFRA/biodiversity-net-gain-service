import constants from '../../utils/constants.js'
import applicant from '../../__mock-data__/test-credits-purchase-application.js'

const seedCreditsEstimationData = {
  method: 'GET',
  path: constants.routes.TEST_CREDITS_PURCHASE_DATA,
  handler: async (request, h) => {
    request.yar._store = JSON.parse(applicant.data)
    return h.view(constants.views.TEST_CREDITS_PURCHASE_DATA)
  }
}

export default seedCreditsEstimationData
