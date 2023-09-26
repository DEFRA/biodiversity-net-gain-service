import constants from '../../../utils/constants.js'
import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
const url = constants.routes.CHOOSE_LAND_BOUNDARY_UPLOAD

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

    it('should display expected error details when no option is selected', (done) => {
      jest.isolateModules(async () => {
        try {
          const response = await submitPostRequest(postOptions, 200)
          expect(response.payload).toContain('There is a problem')
          expect(response.payload).toContain('Select how you want to add the land boundary details for the biodiversity gain site')
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should allow a selection to upload a land boundary using a geospatial file', async () => {
      postOptions.payload.landBoundaryUploadType = constants.landBoundaryUploadTypes.GEOSPATIAL_DATA
      const response = await submitPostRequest(postOptions)
      // Reset mocks before submitting a GET request so that the number of calls to postJson is
      // tested correctly.
      jest.resetAllMocks()
      // Perform a GET request using the existing session cookie to provide test coverage for the case
      // where an existing upload type is selected.
      const cookie = response.headers['set-cookie'][0].split(';')[0]
      await submitGetRequest({
        url,
        headers: { cookie }
      })
      expect(response.headers.location).toEqual(constants.routes.UPLOAD_GEOSPATIAL_LAND_BOUNDARY)
    })
    it('should allow a selection to upload a land boundary using a non-geospatial file', async () => {
      postOptions.payload.landBoundaryUploadType = constants.landBoundaryUploadTypes.DOCUMENT_UPLOAD
      const response = await submitPostRequest(postOptions)
      expect(response.headers.location).toEqual(constants.routes.UPLOAD_LAND_BOUNDARY)
    })
  })
})
