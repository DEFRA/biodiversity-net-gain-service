import constants from '../../../utils/constants.js'
import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
const url = '/land/check-ownership-proof-file'

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
    it('should allow confirmation that the correct land ownership file has been uploaded', async () => {
      postOptions.payload.checkLandOwnership = 'yes'
      await submitPostRequest(postOptions)
    })

    it('should allow an alternative land ownership file to be uploaded ', async () => {
      postOptions.payload.checkLandOwnership = 'no'
      const response = await submitPostRequest(postOptions)
      expect(response.headers.location).toBe(constants.routes.UPLOAD_LAND_OWNERSHIP)
    })

    it('should detect an invalid response from user', async () => {
      await submitPostRequest(postOptions, 200)
    })
  })
})
