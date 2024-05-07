import constants from '../../../utils/constants.js'
import { submitGetRequest, submitPostRequest } from '../helpers/server.js'

const url = '/developer/check-metric-file'
const mockDataPath = 'packages/webapp/src/__mock-data__/uploads/metric-file'
const mockFileLocation = `${mockDataPath}/metric-file.xlsx`

describe(url, () => {
  describe('GET', () => {
    let viewResult, contextResult
    const cacheMap = new Map()
    it(`should render the ${url.substring(1)} view`, async () => {
      const checkMetricFile = require('../../developer/check-metric-file.js')
      cacheMap.set(constants.cacheKeys.DEVELOPER_METRIC_LOCATION, mockFileLocation)
      const request = {
        yar: cacheMap
      }
      const h = {
        view: (view, context) => {
          viewResult = view
          contextResult = context
        }
      }
      await checkMetricFile.default[0].handler(request, h)
      expect(viewResult).toEqual(constants.views.DEVELOPER_CHECK_UPLOAD_METRIC)
      expect(contextResult.filename).toEqual('metric-file.xlsx')
    })

    it('should redirect to the landowner journey task list if a landowner journey is in progress', async () => {
      const cacheMap = new Map()
      cacheMap.set(constants.cacheKeys.APPLICATION_TYPE, constants.applicationTypes.REGISTRATION)
      const response = await submitGetRequest({ url }, 302, Object.fromEntries(cacheMap))
      expect(response.headers.location).toEqual(constants.routes.REGISTER_LAND_TASK_LIST)
    })

    it(`should render the ${url.substring(1)} without file info`, async () => {
      const checkMetricFile = require('../../developer/check-metric-file.js')
      cacheMap.set(constants.cacheKeys.DEVELOPER_METRIC_LOCATION, null)
      const request = {
        yar: cacheMap
      }
      const h = {
        view: (view, context) => {
          viewResult = view
          contextResult = context
        }
      }
      await checkMetricFile.default[0].handler(request, h)
      expect(viewResult).toEqual(constants.views.DEVELOPER_CHECK_UPLOAD_METRIC)
      expect(contextResult.filename).toEqual('')
    })
  })

  describe('POST', () => {
    jest.mock('@defra/bng-connectors-lib')
    let cacheMap, postOptions
    beforeEach(() => {
      cacheMap = new Map()
      postOptions = {
        url,
        payload: {}
      }
    })

    it('should allow an alternative metric file to be uploaded ', (done) => {
      jest.isolateModules(async () => {
        try {
          let viewResult
          const checkMetricFile = require('../../developer/check-metric-file.js')
          cacheMap.set(constants.cacheKeys.DEVELOPER_METRIC_LOCATION, mockFileLocation)
          postOptions.payload.checkUploadMetric = constants.confirmLandBoundaryOptions.NO
          const request = {
            yar: cacheMap,
            payload: {
              checkUploadMetric: constants.confirmLandBoundaryOptions.NO
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
          await checkMetricFile.default[1].handler(request, h)
          expect(viewResult).toEqual(constants.routes.DEVELOPER_UPLOAD_METRIC)
          expect(spy).toHaveBeenCalledWith({
            containerName: 'customer-uploads',
            blobName: mockFileLocation
          })
          expect(spy).toHaveBeenCalledTimes(1)
          done()
        } catch (err) {
          done(err)
        }
      })
    })

    it('should allow confirmation that the correct metric file has been uploaded', async () => {
      postOptions.payload.checkUploadMetric = constants.confirmLandBoundaryOptions.YES
      await submitPostRequest(postOptions)
    })
    it('should detect an invalid response from user', async () => {
      postOptions.payload.checkUploadMetric = 'invalid'
      await submitPostRequest(postOptions, 500)
    })
  })
})
