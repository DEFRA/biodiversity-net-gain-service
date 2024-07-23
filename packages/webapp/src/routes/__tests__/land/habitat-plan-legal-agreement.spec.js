import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.HABITAT_PLAN_LEGAL_AGREEMENT

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
      sessionData[constants.redisKeys.APPLICATION_TYPE] = constants.applicationTypes.REGISTRATION
      postOptions = {
        url,
        payload: {}
      }
    })
    it('Should continue journey to ENHANCEMENT_WORKS_START_DATE if yes is chosen', async () => {
      postOptions.payload.isHabitatIncludeLegalAgreement = 'Yes'
      const res = await submitPostRequest(postOptions, 302, sessionData)
      expect(res.headers.location).toEqual(constants.routes.ENHANCEMENT_WORKS_START_DATE)
    })

    it('Should continue journey to UPLOAD_HABITAT_PLAN if no is chosen', async () => {
      postOptions.payload.isHabitatIncludeLegalAgreement = 'No'
      const res = await submitPostRequest(postOptions, 302, sessionData)
      expect(res.headers.location).toEqual(constants.routes.UPLOAD_HABITAT_PLAN)
    })

    it('Should fail journey if no answer', async () => {
      const res = await submitPostRequest(postOptions, 200, sessionData)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Select yes if the habitat management and monitoring plan')
    })
  })
})
