import constants from '../../../utils/constants.js'
import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
const url = constants.routes.CONFIRM_GEOSPATIAL_LAND_BOUNDARY
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
    it('should result in reselection error result', done => {
      jest.isolateModules(async () => {
        try {
          let viewResult, contextResult
          const redisMap = new Map()
          const checkLandBoundary = require('../../land/check-geospatial-land-boundary-file')
          const request = {
            yar: redisMap,
            payload: {
              confirmGeospatialLandBoundary: undefined
            }
          }
          const h = {
            view: (view, context) => {
              viewResult = view
              contextResult = context
            }
          }
          await checkLandBoundary.default[1].handler(request, h)
          expect(viewResult).toBe(constants.views.CONFIRM_GEOSPATIAL_LAND_BOUNDARY)
          expect(contextResult.err[0]).toStrictEqual({
            text: 'Select yes if this is the correct file',
            href: '#check-upload-correct-yes'
          })
          // expect(contextResult.err[0].text).toEqual('Start date of the 30 year management and monitoring period must be the same as or after the date the habitat enhancement works begin')
          done()
        } catch (err) {
          done(err)
        }
      })
    })
  })
})
