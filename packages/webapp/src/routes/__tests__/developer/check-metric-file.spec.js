import constants from '../../../utils/constants.js'
import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
const url = '/developer/check-metric-file'
const mockDataPath = 'packages/webapp/src/__mock-data__/uploads/metric-file'
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
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
  })

  describe('POST', () => {
    let redisMap, postOptions
    const mockFileLocation = `${mockDataPath}/metric-file.xlsx`
    beforeEach(() => {
      redisMap = new Map()
      postOptions = {
        url,
        payload: {}
      }
    })

    // it('should allow confirmation that the correct metric file has been uploaded', async () => {
    //   postOptions.payload.checkUploadMetric = constants.confirmLandBoundaryOptions.YES
    //   await submitPostRequest(postOptions)
    // })

    it('should allow confirmation that the correct metric file has been uploaded', done => {
      postOptions.payload.checkUploadMetric = constants.confirmLandBoundaryOptions.YES
      jest.isolateModules(async () => {
        try {
          let viewResult
          const confirmDevelopmentDetails = require('../../developer/check-metric-file.js')
          redisMap.set(constants.redisKeys.DEVELOPER_METRIC_LOCATION, mockFileLocation)
          redisMap.set(constants.redisKeys.DEVELOPER_METRIC_DATA, mockMetricData.startPage)
          const request = {
            yar: redisMap
          }
          const h = {
            view: (view) => {
              viewResult = view
            }
          }
          await confirmDevelopmentDetails.default[0].handler(request, h)
          expect(viewResult).toEqual(url.substring(url.indexOf('/') + 1))
          done()
        } catch (err) {
          done(err)
        }
      })
    })

    it('should allow an alternative metric file to be uploaded ', async () => {
      postOptions.payload.checkUploadMetric = constants.confirmLandBoundaryOptions.NO
      const response = await submitPostRequest(postOptions)
      expect(response.headers.location).toBe(constants.routes.DEVELOPER_UPLOAD_METRIC)
    })

    it('should detect an invalid response from user', async () => {
      postOptions.payload.checkUploadMetric = 'invalid'
      await submitPostRequest(postOptions, 500)
    })
  })
})
