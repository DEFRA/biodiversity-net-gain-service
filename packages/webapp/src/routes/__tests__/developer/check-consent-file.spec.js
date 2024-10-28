import constants from '../../../utils/constants.js'
import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import * as azureStorage from '../../../utils/azure-storage.js'
const url = constants.routes.DEVELOPER_CHECK_CONSENT_TO_USE_GAIN_SITE_FILE
jest.mock('../../../utils/azure-storage.js')

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })

    it(`should render the ${url.substring(1)} view with sub heading if needed`, async () => {
      const sessionData = {}
      sessionData[constants.redisKeys.DEVELOPER_IS_AGENT] = constants.APPLICANT_IS_AGENT.YES
      sessionData[constants.redisKeys.DEVELOPER_LANDOWNER_OR_LEASEHOLDER] = constants.DEVELOPER_IS_LANDOWNER_OR_LEASEHOLDER.NO
      const res = await submitGetRequest({ url }, 200, sessionData)
      expect(res.payload).toContain('Proof of permission 2 of 2')
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
    it('should allow confirmation that the correct written authorisation file has been uploaded', async () => {
      postOptions.payload.checkConsentToAllocateGains = 'yes'
      const response = await submitPostRequest(postOptions)
      expect(response.headers.location).toBe(constants.routes.DEVELOPER_TASKLIST)
    })

    it('should allow an alternative written authorisation file to be uploaded ', async () => {
      const spy = jest.spyOn(azureStorage, 'deleteBlobFromContainers')
      postOptions.payload.checkConsentToAllocateGains = 'no'
      const response = await submitPostRequest(postOptions)
      expect(response.headers.location).toBe(constants.routes.DEVELOPER_UPLOAD_CONSENT_TO_ALLOCATE_GAINS)
      expect(spy).toHaveBeenCalledTimes(1)
    })

    it('should detect an invalid response from user', async () => {
      const response = await submitPostRequest(postOptions, 200)
      expect(response.payload).toContain('Select yes if this is the correct file')
    })

    it('should redirect to referer if set and response is yes', async () => {
      postOptions.payload.checkConsentToAllocateGains = 'yes'
      const referer = 'some-referer'
      const sessionData = {
        [constants.redisKeys.REFERER]: referer
      }
      const response = await submitPostRequest(postOptions, 302, sessionData)
      expect(response.headers.location).toBe(referer)
    })

    it('should redirect to journey entry point if referer is not set and response is yes', async () => {
      postOptions.payload.checkConsentToAllocateGains = 'yes'
      const journeyEntryPoint = 'some-journey-entry-point'
      const sessionData = {
        [constants.redisKeys.CHECK_AND_SUBMIT_JOURNEY_ROUTE]: journeyEntryPoint
      }
      const response = await submitPostRequest(postOptions, 302, sessionData)
      expect(response.headers.location).toBe(journeyEntryPoint)
    })

    it('should default to redirecting to tasklist if neither referer nor journey entry point is set and response is yes', async () => {
      postOptions.payload.checkConsentToAllocateGains = 'yes'
      const response = await submitPostRequest(postOptions, 302)
      expect(response.headers.location).toBe(constants.routes.DEVELOPER_TASKLIST)
    })
  })
})
