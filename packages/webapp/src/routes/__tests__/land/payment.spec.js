import createPayment from '../../../payment/gov-pay-api/payment-create.js'
import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'

jest.mock('../../../payment/gov-pay-api/payment-create.js')

const url = constants.routes.LAND_PAYMENT

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      const testUrl = 'testUrl'
      createPayment.mockResolvedValue({
        _links: {
          next_url: {
            href: testUrl
          }
        }
      })
      const response = await submitGetRequest({ url }, 302)
      expect(response.headers.location).toEqual(testUrl)
    })
  })
})
