import constants from '../../../utils/constants.js'
import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
const url = '/land/check-geospatial-land-boundary-file'

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
    it('should allow confirmation that the correct file has been uploaded', async () => {
      postOptions.payload.confirmGeospatialLandBoundary = constants.confirmLandBoundaryOptions.YES
      await submitPostRequest(postOptions)
    })
    it('should allow an alternative geospatial or non-geospatial file to be uploaded ', async () => {
      postOptions.payload.confirmGeospatialLandBoundary = constants.confirmLandBoundaryOptions.NO
      const response = await submitPostRequest(postOptions)
      expect(response.headers.location).toBe(constants.routes.UPLOAD_GEOSPATIAL_LAND_BOUNDARY)
    })
  })
})
