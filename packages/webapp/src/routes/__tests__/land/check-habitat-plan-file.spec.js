import constants from '../../../utils/constants.js'
import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import * as azureStorage from '../../../utils/azure-storage.js'
const url = constants.routes.CHECK_HABITAT_PLAN_FILE
jest.mock('../../../utils/azure-storage.js')

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
  })

  describe('POST', () => {
    let postOptions
    const sessionData = {}
    beforeAll(async () => {
      sessionData[constants.redisKeys.APPLICATION_TYPE] = constants.applicationTypes.REGISTRATION
    })
    beforeEach(() => {
      postOptions = {
        url,
        payload: {}
      }
    })
    it('should allow confirmation that the correct habitat plan file has been uploaded', async () => {
      postOptions.payload.checkHabitatPlan = constants.confirmLegalAgreementOptions.YES
      await submitPostRequest(postOptions, 302, sessionData)
    })

    it('should allow an alternative habitat plan file to be uploaded ', async () => {
      const spy = jest.spyOn(azureStorage, 'deleteBlobFromContainers')
      postOptions.payload.checkHabitatPlan = 'no'
      const response = await submitPostRequest(postOptions, 302, sessionData)
      expect(response.headers.location).toBe(constants.routes.UPLOAD_HABITAT_PLAN)
      expect(spy).toHaveBeenCalledTimes(0)
    })
    it('should detect an invalid response from user', async () => {
      const response = await submitPostRequest(postOptions, 200, sessionData)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Select yes if this is the correct file')
    })
  })
})
