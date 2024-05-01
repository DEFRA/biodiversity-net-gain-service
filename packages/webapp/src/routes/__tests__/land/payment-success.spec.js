import { paymentDetails } from '../../../payment/gov-pay-api/payment-details.js'
import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'

jest.mock('../../../payment/gov-pay-api/payment-details.js')

const url = constants.routes.LAND_PAYMENT_SUCCESS

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      paymentDetails.mockResolvedValue({
        amount: 100,
        description: 'test',
        state: {
          message: 'message'
        }
      })
      await submitGetRequest({ url })
    })
  })
})
