import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.NEED_ADD_ALL_LEGAL_FILES

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({
        headers: {
          referer: constants.routes.NEED_ADD_ALL_LEGAL_FILES
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
      expect(res.headers.location).toEqual('/land/upload-legal-agreement')
    })
  })
})
