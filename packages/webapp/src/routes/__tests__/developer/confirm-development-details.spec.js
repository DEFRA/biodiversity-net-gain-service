import Session from '../../../__mocks__/session.js'
import constants from '../../../utils/constants.js'
import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import confirmDevDetails from '../../developer/confirm-development-details.js'
import * as azureStorage from '../../../utils/azure-storage.js'

jest.mock('../../../utils/azure-storage.js')

const url = constants.routes.DEVELOPER_CONFIRM_DEV_DETAILS
const urlResult = constants.routes.DEVELOPER_CONFIRM_OFF_SITE_GAIN

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
      const spy = jest.spyOn(azureStorage, 'deleteBlobFromContainers')
      postOptions.payload.confirmDevDetails = constants.CONFIRM_DEVELOPMENT_DETAILS.NO
      const response = await submitPostRequest(postOptions)
      expect(response.headers.location).toBe(constants.routes.DEVELOPER_UPLOAD_METRIC)
      expect(spy).toHaveBeenCalledTimes(1)
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
            confirmDevDetails: constants.CONFIRM_DEVELOPMENT_DETAILS.YES
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
          expect(redirectArgs[0]).toEqual(urlResult)
          done()
        } catch (err) {
          done(err)
        }
      })
    })
  })
})
