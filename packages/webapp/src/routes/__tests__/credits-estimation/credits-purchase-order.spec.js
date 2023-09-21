import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../credits/constants.js'
const url = constants.routes.ESTIMATOR_CREDITS_PURCHASE_ORDER

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${constants.views.ESTIMATOR_CREDITS_PURCHASE_ORDER} view`, async () => {
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

    it('should store option value if any option is selected', async () => {
      postOptions.payload = { willPOInUse: 'yes', purchaseOrderNumber: 'TST123' }
      const res = await submitPostRequest(postOptions, 200)

      // Note: Need to change the location once next page will be available
      expect(res.headers.location).toBeUndefined()
    })

    it('should display an error if no one option is selected', async () => {
      postOptions.payload = { willPOInUse: undefined, purchaseOrderNumber: undefined }
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('Select yes if you will be using a purchase order')
    })

    it('should display an error if option `Yes` is selected and purchase order number is blank', async () => {
      postOptions.payload = { willPOInUse: 'yes', purchaseOrderNumber: undefined }
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('Purchase order number cannot be left blank')
    })

    it('should navigate to next page if option `No` is selected', async () => {
      postOptions.payload = { willPOInUse: 'no', purchaseOrderNumber: undefined }
      const res = await submitPostRequest(postOptions, 200)

      // Note: Need to change the location once next page will be available
      expect(res.headers.location).toBeUndefined()
    })
  })
})
