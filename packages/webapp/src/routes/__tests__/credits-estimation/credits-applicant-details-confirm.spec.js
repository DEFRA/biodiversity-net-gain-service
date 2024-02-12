import constants from '../../../utils/constants.js'
import { submitGetRequest } from '../helpers/server.js'

const url = constants.routes.CREDITS_APPLICANT_CONFIRM

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${constants.views.CREDITS_APPLICANT_CONFIRM} view`, async () => {
      await submitGetRequest({ url })
    })
  })
})
