import constants from '../../../utils/constants.js'
import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import * as azureStorage from '../../../utils/azure-storage.js'
const url = constants.routes.DEVELOPER_CHECK_PLANNING_DECISION_NOTICE_FILE
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
    beforeEach(() => {
      postOptions = {
        url,
        payload: {}
      }
      sessionData[constants.redisKeys.APPLICATION_TYPE] = constants.applicationTypes.ALLOCATION
    })
    it('should allow confirmation that the correct planning decision document file has been uploaded', async () => {
      postOptions.payload.checkPlanningDecisionNotice = 'yes'
      const response = await submitPostRequest(postOptions, 302, sessionData)
      expect(response.headers.location).toBe(constants.routes.DEVELOPER_TASKLIST)
    })

    it('should allow an alternative planning decision document file to be uploaded ', async () => {
      const spy = jest.spyOn(azureStorage, 'deleteBlobFromContainers')
      postOptions.payload.checkPlanningDecisionNotice = 'no'
      const response = await submitPostRequest(postOptions, 302, sessionData)
      expect(response.headers.location).toBe(constants.routes.DEVELOPER_UPLOAD_PLANNING_DECISION_NOTICE)
      expect(spy).toHaveBeenCalledTimes(1)
    })

    it('should detect an invalid response from user', async () => {
      const response = await submitPostRequest(postOptions, 200, sessionData)
      expect(response.payload).toContain('Select yes if this is the correct file')
    })
  })
})
