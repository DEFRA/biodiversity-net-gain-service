import constants from '../../../utils/constants.js'

import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
const url = constants.routes.CHECK_OWNERSHIP_DETAILS

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
    it('Should continue journey to consent being ticked', async () => {
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(constants.routes.REGISTER_LAND_TASK_LIST)
    })
  })
})
