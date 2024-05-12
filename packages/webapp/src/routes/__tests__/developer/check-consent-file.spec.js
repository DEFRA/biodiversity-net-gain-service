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
  })
})
