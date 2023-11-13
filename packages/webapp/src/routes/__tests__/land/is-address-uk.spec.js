import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
import application from '../../../__mock-data__/test-application.js'

const url = constants.routes.IS_ADDRESS_UK
const postOptions = {
  url,
  payload: {}
}

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      const sessionData = JSON.parse(application.dataString)
      sessionData[constants.redisKeys.APPLICANT_DETAILS_IS_AGENT] = 'no'
      const response = await submitGetRequest({ url }, 200, sessionData)
      expect(response.payload).toContain('Is your address in the UK?')
    })
    it(`should render the ${url.substring(1)} view and ask for client's address`, async () => {
      const sessionData = JSON.parse(application.dataString)
      sessionData[constants.redisKeys.IS_AGENT] = 'yes'
      const response = await submitGetRequest({ url }, 200, sessionData)
      expect(response.payload).toContain('Is your client&#39;s address in the UK?')
    })
  })
  describe('POST', () => {
    it('Should redirect to uk-address if yes selected', async () => {
      postOptions.payload.isAddressUk = 'yes'
      const response = await submitPostRequest(postOptions)
      expect(response.request.response.headers.location).toBe(constants.routes.UK_ADDRESS)
    })
    it('Should redirect to non-uk-address if no selected', async () => {
      postOptions.payload.isAddressUk = 'no'
      const response = await submitPostRequest(postOptions)
      expect(response.request.response.headers.location).toBe(constants.routes.NON_UK_ADDRESS)
    })
    it('Should return view with error if nothing is selected', async () => {
      postOptions.payload.isAddressUk = null
      const response = await submitPostRequest(postOptions, 200)
      expect(response.payload).toContain('Select yes if your address is in the UK')
    })
    it('Should return view with error if nothing is selected and ask for client\'s address', async () => {
      postOptions.payload.isAddressUk = null
      const sessionData = JSON.parse(application.dataString)
      sessionData[constants.redisKeys.IS_AGENT] = 'yes'
      const response = await submitPostRequest(postOptions, 200, sessionData)
      expect(response.payload).toContain('Select yes if your client&#39;s address is in the UK')
    })
  })
})
