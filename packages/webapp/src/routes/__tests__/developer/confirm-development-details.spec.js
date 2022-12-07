import Session from '../helpers/session.js'
import constants from '../../../utils/constants.js'
import { submitPostRequest } from '../helpers/server.js'
import confirmDevDetails from '../../developer/confirm-development-details.js'

jest.mock('@defra/bng-connectors-lib')

const url = constants.routes.DEVELOPER_CONFIRM_DEV_DETAILS
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
    let redisMap
    const mockFileLocation = `${mockDataPath}/metric-file.xlsx`
    beforeEach(() => {
      redisMap = new Map()
    })

    it('It should download the mocked metric file data from blobStorageConnector', done => {
      jest.isolateModules(async () => {
        try {
          let viewResult
          const confirmDevelopmentDetails = require('../../developer/confirm-development-details.js')
          redisMap.set(constants.redisKeys.DEVELOPER_METRIC_LOCATION, mockFileLocation)
          // redisMap.set(constants.redisKeys.DEVELOPER_METRIC_DATA, mockMetricData)
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
  })

  describe('POST', () => {
    let postOptions
    beforeEach(() => {
      postOptions = {
        url,
        payload: {}
      }
    })
    it('should allow confirmation that the correct metric file has been uploaded', async () => {
      postOptions.payload.confirmDevDetails = constants.CONFIRM_DEVELOPMENT_DETAILS.YES
      await submitPostRequest(postOptions)
    })

    it('should allow an alternative metric file to be uploaded ', async () => {
      postOptions.payload.confirmDevDetails = constants.CONFIRM_DEVELOPMENT_DETAILS.NO
      const response = await submitPostRequest(postOptions)
      expect(response.headers.location).toBe(constants.routes.DEVELOPER_UPLOAD_METRIC)
    })

    it('should detect an invalid response from user', async () => {
      postOptions.payload.confirmDevDetails = 'invalid'
      await submitPostRequest(postOptions, 500)
    })
    it('Ensure page uses referrer if is set on post', done => {
      jest.isolateModules(async () => {
        try {
          const postHandler = confirmDevDetails[1].handler
          const session = new Session()
          session.set(constants.redisKeys.DEVELOPER_METRIC_DATA, mockMetricData.startPage)
          session.set('filename', constants.redisKeys.METRIC_LOCATION)
          const payload = {
            confirmDevDetails: 'yes'
          }
          let viewArgs = ''
          let redirectArgs = ''
          const h = {
            view: (...args) => {
              viewArgs = args
            },
            redirect: (...args) => {
              redirectArgs = args
            }
          }

          await postHandler({ payload, yar: session }, h)
          expect(viewArgs).toEqual('')
          expect(redirectArgs[0]).toEqual(url)
          done()
        } catch (err) {
          done(err)
        }
      })
    })
  })
})
