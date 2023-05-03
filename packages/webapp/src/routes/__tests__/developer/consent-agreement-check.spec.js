import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants'

const url = constants.routes.DEVELOPER_CONSENT_AGREEMENT_CHECK

jest.mock('../../../utils/azure-signalr.js')

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
  })
})
