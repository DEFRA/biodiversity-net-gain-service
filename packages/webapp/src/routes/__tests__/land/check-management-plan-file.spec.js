import constants from '../../../utils/constants.js'
import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
const url = '/land/check-management-plan-file'

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
    it('should allow confirmation that the correct management plan file has been uploaded', async () => {
      postOptions.payload.checkManagementPlan = constants.confirmManagementPlanOptions.YES
      await submitPostRequest(postOptions)
    })

    it('should allow an alternative management plan file to be uploaded ', async () => {
      postOptions.payload.checkManagementPlan = constants.confirmManagementPlanOptions.NO
      const response = await submitPostRequest(postOptions)
      expect(response.headers.location).toBe(constants.routes.UPLOAD_MANAGEMENT_PLAN)
    })

    it('should detect an invalid response from user', async () => {
      await submitPostRequest(postOptions, 200)
    })
  })
})
