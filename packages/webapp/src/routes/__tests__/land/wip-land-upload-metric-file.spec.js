import { submitGetRequest } from '../helpers/server.js'
import creditsPurchaseConstants from '../../../utils/credits-purchase-constants.js'
import { runCommonUploadTests } from '../helpers/upload-metric-test-helper.spec.js'

const url = creditsPurchaseConstants.routes.CREDITS_PURCHASE_UPLOAD_METRIC
const uploadType = creditsPurchaseConstants.uploadTypes.CREDITS_PURCHASE_METRIC_UPLOAD_TYPE

describe('Metric file upload controller tests', () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
  })
  runCommonUploadTests(uploadType, url, creditsPurchaseConstants)
})
