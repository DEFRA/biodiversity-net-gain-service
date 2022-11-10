import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants'
const url = constants.routes.CHECK_YOUR_DETAILS

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
    it('Should continue journey', async () => {
      await submitPostRequest(postOptions)
    })
  })
})
