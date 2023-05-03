import Session from '../../../__mocks__/session.js'
import constants from '../../../utils/constants.js'
import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import checkMetricFile from '../../land/check-metric-file.js'
import * as azureStorage from '../../../utils/azure-storage.js'
const url = constants.routes.CHECK_UPLOAD_METRIC
jest.mock('../../../utils/azure-storage.js')

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
    it('should redirect to Start page if no data applicant data is available in session', async () => {
      const response = await submitGetRequest({ url }, 302, {})
      expect(response.headers.location).toEqual(constants.routes.START)
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
      postOptions.payload.checkUploadMetric = constants.confirmLandBoundaryOptions.YES
      await submitPostRequest(postOptions)
    })

    it('should allow an alternative metric file to be uploaded ', async () => {
      const spy = jest.spyOn(azureStorage, 'deleteBlobFromContainers')
      postOptions.payload.checkUploadMetric = constants.confirmLandBoundaryOptions.NO
      const response = await submitPostRequest(postOptions)
      expect(response.headers.location).toBe(constants.routes.UPLOAD_METRIC)
      expect(spy).toHaveBeenCalledTimes(1)
    })

    it('should detect an invalid response from user', async () => {
      postOptions.payload.confirmGeospatialLandBoundary = 'invalid'
      await submitPostRequest(postOptions, 500)
    })
    it('Ensure page uses referrer if is set on post', done => {
      jest.isolateModules(async () => {
        try {
          const postHandler = checkMetricFile[1].handler
          const session = new Session()
          session.set(constants.redisKeys.REFERER, '/land/check-and-submit')
          const payload = {
            checkUploadMetric: 'yes'
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
          expect(redirectArgs[0]).toEqual('/land/check-and-submit')
          done()
        } catch (err) {
          done(err)
        }
      })
    })
  })
})
