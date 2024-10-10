import constants from '../../../utils/constants.js'
import { submitPostRequest } from '../helpers/server.js'

const url = '/combined-case/check-allocation-metric'
const mockDataPath = 'packages/webapp/src/__mock-data__/uploads/metric-file'
const mockFileLocation = `${mockDataPath}/metric-file.xlsx`

describe(url, () => {
  describe('GET', () => {
    let viewResult, contextResult
    const redisMap = new Map()
    it(`should render the ${url.substring(1)} view`, async () => {
      const checkMetricFile = require('../../combined-case/check-allocation-metric.js')
      redisMap.set(constants.redisKeys.DEVELOPER_METRIC_LOCATION, mockFileLocation)
      const request = {
        yar: redisMap
      }
      const h = {
        view: (view, context) => {
          viewResult = view
          contextResult = context
        }
      }
      await checkMetricFile.default[0].handler(request, h)
      expect(viewResult).toEqual(constants.views.COMBINED_CASE_CHECK_UPLOAD_ALLOCATION_METRIC)
      expect(contextResult.filename).toEqual('metric-file.xlsx')
    })

    it(`should render the ${url.substring(1)} without file info`, async () => {
      const checkMetricFile = require('../../combined-case/check-allocation-metric.js')
      redisMap.set(constants.redisKeys.DEVELOPER_METRIC_LOCATION, null)
      const request = {
        yar: redisMap
      }
      const h = {
        view: (view, context) => {
          viewResult = view
          contextResult = context
        }
      }
      await checkMetricFile.default[0].handler(request, h)
      expect(viewResult).toEqual(constants.views.COMBINED_CASE_CHECK_UPLOAD_ALLOCATION_METRIC)
      expect(contextResult.filename).toEqual('')
    })
  })

  describe('POST', () => {
    jest.mock('@defra/bng-connectors-lib')
    let redisMap, postOptions
    beforeEach(() => {
      redisMap = new Map()
      postOptions = {
        url,
        payload: {}
      }
    })

    it('should allow an alternative metric file to be uploaded ', (done) => {
      jest.isolateModules(async () => {
        try {
          let viewResult
          const checkMetricFile = require('../../combined-case/check-allocation-metric.js')
          redisMap.set(constants.redisKeys.DEVELOPER_METRIC_LOCATION, mockFileLocation)
          postOptions.payload.checkUploadMetric = constants.confirmLandBoundaryOptions.NO
          const request = {
            yar: redisMap,
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
          await checkMetricFile.default[1].handler(request, h)
          expect(viewResult).toEqual(constants.routes.COMBINED_CASE_UPLOAD_ALLOCATION_METRIC)
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
