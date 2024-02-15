import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import creditsPurchaseConstants from '../../../utils/credits-purchase-constants.js'

const url = creditsPurchaseConstants.routes.CHECK_DEFRA_ACCOUNT_DETAILS

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

    // it('Should continue the journey when ind/ord is selected and Defra account details are confirmed', async () => {
    //   postOptions.payload.defraAccountDetailsConfirmed = 'true'
    //   const sessionData = {}
    //   sessionData[creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_INDIVIDUAL_ORG] = 'individual'
    //   const res = await submitPostRequest(postOptions, 302, sessionData)
    //   expect(res.headers.location).toEqual(creditsPurchaseConstants.routes.REGISTER_CREDIT_PURCHASE_TASK_LIST)
    // })

    it('Should stop the journey when Defra account details are unconfirmed', async () => {
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('You must confirm your Defra account details are up to date')
    })
  })
})
