import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
import { runCommonUploadTests } from '../helpers/upload-metric-test-helper.spec.js'

const url = constants.routes.DEVELOPER_UPLOAD_METRIC
const uploadType = constants.uploadTypes.DEVELOPER_METRIC_UPLOAD_TYPE

describe('Metric file upload controller tests', () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
  })
  runCommonUploadTests(uploadType, url, constants)
})
