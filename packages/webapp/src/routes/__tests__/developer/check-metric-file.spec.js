import constants from '../../../utils/constants.js'
import { submitPostRequest } from '../helpers/server.js'

const url = '/developer/check-metric-file'
const mockDataPath = 'packages/webapp/src/__mock-data__/uploads/metric-file'
const mockFileLocation = `${mockDataPath}/metric-file.xlsx`
const mockMetricData = {
  startPage: {
    planningAuthority: 'Your District Council ',
    projectName: 'A Major Development',
    applicant: 'A Developer',
    applicationType: 'Outline Planning',
    planningApplicationReference: 'A111111',
    assessor: 'A.Junior',
    reviewer: 'A.Senior',
    metricVersion: 'v1.1',
    assessmentDate: 44441,
    planningAuthorityReviewer: 'A.N.Officer',
    cellStyleConventions: undefined,
    enterData: undefined,
    automaticLookup: undefined,
    result: undefined
  }
}

describe(url, () => {
  describe('GET', () => {
    let viewResult, contextResult
    const redisMap = new Map()
    it(`should render the ${url.substring(1)} view`, async () => {
      const checkMetricFile = require('../../developer/check-metric-file.js')
      redisMap.set(constants.redisKeys.DEVELOPER_METRIC_LOCATION, mockFileLocation)
      // redisMap.set(constants.redisKeys.DEVELOPER_METRIC_FILE_SIZE, (4 * 1024))
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
      expect(viewResult).toEqual(constants.views.DEVELOPER_CHECK_UPLOAD_METRIC)
      expect(contextResult.filename).toEqual('metric-file.xlsx')
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

    it('should allow confirmation that the correct metric file has been uploaded', (done) => {
      jest.isolateModules(async () => {
        try {
          const checkMetricFile = require('../../developer/check-metric-file.js')
          redisMap.set(constants.redisKeys.DEVELOPER_METRIC_LOCATION, mockFileLocation)
          redisMap.set(constants.redisKeys.DEVELOPER_METRIC_DATA, mockMetricData)
          const request = {
            yar: redisMap,
            payload: {
              checkUploadMetric: constants.confirmLandBoundaryOptions.YES
            }
          }
          const extractDeveloperMetric = require('../../../utils/extract-developer-metric.js')
          const spy = jest.spyOn(extractDeveloperMetric, 'extractMetricData')
          await checkMetricFile.default[1].handler(request)
          expect(spy).toHaveBeenCalledTimes(1)
          done()
        } catch (err) {
          done(err)
        }
      })
    }, 1800000)

    it('should allow an alternative metric file to be uploaded ', (done) => {
      jest.isolateModules(async () => {
        try {
          let viewResult
          const checkMetricFile = require('../../developer/check-metric-file.js')
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
          const { blobStorageConnector } = require('@defra/bng-connectors-lib')
          const spy = jest.spyOn(blobStorageConnector, 'deleteBlobIfExists')
          await checkMetricFile.default[1].handler(request, h)
          expect(viewResult).toEqual(constants.routes.DEVELOPER_UPLOAD_METRIC)
          expect(spy).toHaveBeenCalledWith({
            containerName: 'untrusted',
            blobName: mockFileLocation
          })
          done()
        } catch (err) {
          done(err)
        }
      })
    })

    it('should detect an invalid response from user', async () => {
      postOptions.payload.checkUploadMetric = 'invalid'
      await submitPostRequest(postOptions, 500)
    })
  })
})
