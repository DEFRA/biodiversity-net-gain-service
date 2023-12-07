import constants from '../../../utils/constants.js'
import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import * as azureStorage from '../../../utils/azure-storage.js'
const url = constants.routes.CHECK_WRITTEN_AUTHORISATION_FILE
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
      postOptions.payload.checkWrittenAuthorisation = 'yes'
      const response = await submitPostRequest(postOptions)
      expect(response.headers.location).toBe(constants.routes.CHECK_APPLICANT_INFORMATION)
    })

    it('should allow an alternative written authorisation file to be uploaded ', async () => {
      const spy = jest.spyOn(azureStorage, 'deleteBlobFromContainers')
      postOptions.payload.checkWrittenAuthorisation = 'no'
      const response = await submitPostRequest(postOptions)
      expect(response.headers.location).toBe(constants.routes.UPLOAD_WRITTEN_AUTHORISATION)
      expect(spy).toHaveBeenCalledTimes(0)
    })

    it('should detect an invalid response from user', async () => {
      const response = await submitPostRequest(postOptions, 200)
      expect(response.payload).toContain('Select yes if this is the correct file')
    })
  })
})
