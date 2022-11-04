import constants from '../../../utils/constants.js'
import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
const url = '/land/check-land-boundary-details'

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
    it('should flow to register task list', async () => {
      const response = await submitPostRequest(postOptions)
      expect(response.headers.location).toBe(constants.routes.REGISTER_LAND_TASK_LIST)
    })
  })
})
