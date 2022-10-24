import constants from '../../../utils/constants.js'
import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
const url = '/land/check-legal-agreement-file'

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
    it('should allow confirmation that the correct legal agreement file has been uploaded', async () => {
      postOptions.payload.checkLegalAgreement = constants.confirmLegalAgreementOptions.YES
      await submitPostRequest(postOptions)
    })

    it('should allow an alternative legal agreement file to be uploaded ', async () => {
      postOptions.payload.checkLegalAgreement = constants.confirmLegalAgreementOptions.NO
      const response = await submitPostRequest(postOptions)
      expect(response.headers.location).toBe(constants.routes.UPLOAD_LEGAL_AGREEMENT)
    })

    it('should detect an invalid response from user', async () => {
      await submitPostRequest(postOptions, 200)
    })
  })
})
