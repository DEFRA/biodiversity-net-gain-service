import { paymentDetails } from '../../../payment/gov-pay-api/payment-details.js'
import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'

jest.mock('../../../payment/gov-pay-api/payment-details.js')

const url = constants.routes.LAND_PAYMENT_RETURN

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      paymentDetails.mockResolvedValue({
        state: {
          status: 'status'
        }
      })
      await submitGetRequest({ url }, 302)
    })
    it('should redirect to failure', async () => {
      paymentDetails.mockResolvedValue({
        state: {
          status: constants.paymentStatus.FAILED
        }
      })
      const response = await submitGetRequest({ url }, 302)
      expect(response.headers.location).toEqual(constants.routes.LAND_PAYMENT_FAILURE)
    })
    it('should redirect to success', async () => {
      paymentDetails.mockResolvedValue({
        state: {
          status: 'status'
        }
      })
      const response = await submitGetRequest({ url }, 302)
      expect(response.headers.location).toEqual(constants.routes.LAND_PAYMENT_SUCCESS)
    })
  })
})
