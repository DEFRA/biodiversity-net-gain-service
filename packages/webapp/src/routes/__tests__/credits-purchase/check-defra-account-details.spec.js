import creditsPurchaseConstants from '../../../utils/credits-purchase-constants.js'
import { submitGetRequest, submitPostRequest } from '../helpers/server.js'

const url = creditsPurchaseConstants.routes.CREDITS_PURCHASE_CHECK_DEFRA_ACCOUNT_DETAILS

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
  })
  describe('POST', () => {
    let postOptions
    beforeEach(() => {
      postOptions = {
        url,
        payload: {}
      }
    })

    it('Should continue to task list journey when Defra account details are confirmed for individual', async () => {
      postOptions.payload.defraAccountDetailsConfirmed = 'true'
      const sessionData = {
        [creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_USER_TYPE]: creditsPurchaseConstants.applicantTypes.INDIVIDUAL
      }
      postOptions.payload.userType = creditsPurchaseConstants.applicantTypes.INDIVIDUAL
      const res = await submitPostRequest(postOptions, 302, sessionData)
      expect(res.headers.location).toEqual(creditsPurchaseConstants.routes.CREDITS_PURCHASE_MIDDLE_NAME)
    })

    it('Should continue to task list journey when Defra account details are confirmed for organisation', async () => {
      postOptions.payload.defraAccountDetailsConfirmed = 'true'
      const sessionData = {
        [creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_USER_TYPE]: creditsPurchaseConstants.applicantTypes.ORGANISATION
      }
      const res = await submitPostRequest(postOptions, 302, sessionData)
      expect(res.headers.location).toEqual(creditsPurchaseConstants.routes.CREDITS_PURCHASE_TASK_LIST)
    })

    it('Should stop the journey when Defra account details are unconfirmed', async () => {
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('You must confirm your Defra account details are up to date')
    })
  })
})
