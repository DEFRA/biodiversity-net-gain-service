import constants from '../../../utils/constants.js'
import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
const url = '/land/choose-land-boundary-upload-option'

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
    it('should allow a selection to upload a land boundary using a geospatial file', async () => {
      postOptions.payload.landBoundaryUploadType = constants.landBoundaryUploadTypes.GEOSPATIAL_DATA
      const response = await submitPostRequest(postOptions)
      // Perform a GET request using the existing session cooke to provide test coverage for the case
      // where an existing upload type is selected.
      const cookie = response.headers['set-cookie'][0].split(';')[0]
      await submitGetRequest({
        url,
        headers: { cookie }
      })
    })
    // TO DO - Refactor this test when non-geospatial land boundary uploads are supported.
    it('should return a 404 response code when a selection to upload a land boundary using a non-geospatial file is made', async () => {
      postOptions.payload.landBoundaryUploadType = constants.landBoundaryUploadTypes.DOCUMENT_UPLOAD
      await submitPostRequest(postOptions, 404)
    })
  })
})
