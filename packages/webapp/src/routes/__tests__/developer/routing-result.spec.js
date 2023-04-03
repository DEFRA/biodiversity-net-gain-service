import constants from '../../../utils/constants.js'
import { submitGetRequest, submitPostRequest } from '../helpers/server.js'

const url = constants.routes.DEVELOPER_ROUTING_RESULT

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
        url
      }
    })

    it('should redirect to the eligibility england after click on continue', async () => {
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(constants.routes.DEVELOPER_ELIGIBILITY_ENGLAND)
    })
  })
})
