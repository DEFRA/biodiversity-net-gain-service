import constants from '../../../utils/constants.js'
import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
const url = '/land/check-land-boundary-file'

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
    it('should allow an alternative geospatial file to be uploaded ', async () => {
      postOptions.payload.confirmGeospatialLandBoundary = constants.confirmLandBoundaryOptions.NO_AGAIN
      const response = await submitPostRequest(postOptions)
      expect(response.headers.location).toBe(constants.routes.UPLOAD_GEOSPATIAL_LAND_BOUNDARY)
    })
    it('should allow an alternative geospatial or non-geospatial file to be uploaded ', async () => {
      postOptions.payload.confirmGeospatialLandBoundary = constants.confirmLandBoundaryOptions.NO
      const response = await submitPostRequest(postOptions)
      expect(response.headers.location).toBe(constants.routes.LAND_BOUNDARY_UPLOAD_TYPE)
    })
    it('should detect an invalid response ', async () => {
      postOptions.payload.confirmGeospatialLandBoundary = 'invalid'
      await submitPostRequest(postOptions, 200)
    })
  })
})
