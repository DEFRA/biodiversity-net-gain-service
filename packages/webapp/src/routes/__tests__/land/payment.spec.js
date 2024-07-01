import createPayment from '../../../payment/gov-pay-api/payment-create.js'
import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'

import applicationValidation from '../../../utils/application-validation.js'
import { getTaskList } from '../../../journey-validation/task-list-generator.js'

jest.mock('../../../payment/gov-pay-api/payment-create.js')
jest.mock('../../../journey-validation/task-list-generator.js')
jest.mock('../../../utils/application-validation.js')
jest.mock('../../../payment/gov-pay-api/payment-create.js')
jest.mock('../../../utils/http.js')

const url = constants.routes.LAND_PAYMENT

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      const testUrl = 'testUrl'
      getTaskList.mockReturnValueOnce({ canSubmit: true })
      applicationValidation.validate.mockReturnValueOnce({
        value: {
          landownerGainSiteRegistration: {
            payment: {
              reference: 'TESTREF'
            }
          }
        },
        error: null
      })
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
    it('should redirect to register land task list when canSubmit is false', async () => {
      getTaskList.mockReturnValueOnce({ canSubmit: false })
      const response = await submitGetRequest({ url }, 302)
      expect(response.headers.location).toEqual(constants.routes.REGISTER_LAND_TASK_LIST)
    })
    it('should throw an error when application validation fails', async () => {
      getTaskList.mockReturnValueOnce({ canSubmit: true })
      const validationError = new Error('Validation error')
      applicationValidation.validate.mockReturnValueOnce({ value: null, error: validationError })
      await submitGetRequest({ url }, 500)
    })
  })
})
