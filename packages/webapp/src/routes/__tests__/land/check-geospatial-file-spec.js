import constants from '../../../utils/constants.js'
import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
const url = constants.routes.CHECK_GEOSPATIAL_FILE

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
  })
  describe('POST', () => {
    jest.mock('@defra/bng-connectors-lib')
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
    it('should allow an alternative geospatial file to replace an existing GeoJSON file', done => {
      jest.isolateModules(async () => {
        try {
          let viewResult
          const redisMap = new Map()
          redisMap.set(constants.redisKeys.GEOSPATIAL_UPLOAD_LOCATION, 'path/to/mock.geojson')
          const checkLandBoundary = require('../../land/check-geospatial-file')
          const request = {
            yar: redisMap,
            payload: {
              confirmGeospatialLandBoundary: constants.confirmLandBoundaryOptions.NO
            }
          }
          const h = {
            redirect: (view) => {
              viewResult = view
            },
            view: (view) => {
              viewResult = view
            }
          }
          const { blobStorageConnector } = require('@defra/bng-connectors-lib')
          const spy = jest.spyOn(blobStorageConnector, 'deleteBlobIfExists')
          await checkLandBoundary.default[1].handler(request, h)
          expect(viewResult).toEqual(constants.routes.UPLOAD_GEOSPATIAL_LAND_BOUNDARY)
          expect(spy).toHaveBeenCalledTimes(1)
          done()
        } catch (err) {
          done(err)
        }
      })
    })
    it('should allow an alternative geospatial file to replace an existing non-GeoJSON file', done => {
      jest.isolateModules(async () => {
        try {
          let viewResult
          const redisMap = new Map()
          redisMap.set(constants.redisKeys.GEOSPATIAL_UPLOAD_LOCATION, 'path/to/mock.geojson')
          redisMap.set(constants.redisKeys.ORIGINAL_GEOSPATIAL_UPLOAD_LOCATION, 'path/to/mock.geopkg')
          const checkLandBoundary = require('../../land/check-geospatial-file')
          const request = {
            yar: redisMap,
            payload: {
              confirmGeospatialLandBoundary: constants.confirmLandBoundaryOptions.NO
            }
          }
          const h = {
            redirect: (view) => {
              viewResult = view
            },
            view: (view) => {
              viewResult = view
            }
          }
          const { blobStorageConnector } = require('@defra/bng-connectors-lib')
          const spy = jest.spyOn(blobStorageConnector, 'deleteBlobIfExists')
          await checkLandBoundary.default[1].handler(request, h)
          expect(viewResult).toEqual(constants.routes.UPLOAD_GEOSPATIAL_LAND_BOUNDARY)
          // The existing Geopackage and the generated GeoJSON equivalent should be removed.
          expect(spy).toHaveBeenCalledTimes(2)
          done()
        } catch (err) {
          done(err)
        }
      })
    })
    it('should result in reselection error result', done => {
      jest.isolateModules(async () => {
        try {
          let viewResult, contextResult
          const redisMap = new Map()
          const checkLandBoundary = require('../../land/check-geospatial-file')
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
          expect(viewResult).toBe(constants.views.CHECK_GEOSPATIAL_FILE)
          expect(contextResult.err[0]).toStrictEqual({
            text: 'Select yes if this is the correct file',
            href: '#check-upload-correct-yes'
          })
          done()
        } catch (err) {
          done(err)
        }
      })
    })
  })
})
