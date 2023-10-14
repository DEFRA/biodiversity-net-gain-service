import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.NEED_ADD_ALL_RESPONSIBLE_BODIES

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({
        headers: {
          referer: constants.routes.NEED_ADD_ALL_RESPONSIBLE_BODIES
        },
        url
      })
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
    it('Should continue journey if Continue button clicked', async () => {
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual('/land/add-responsible-body-conservation-covenant')
    })
  })
})
