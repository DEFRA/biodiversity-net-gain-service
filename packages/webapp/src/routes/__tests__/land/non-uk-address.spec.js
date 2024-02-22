import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
import application from '../../../__mock-data__/test-application.js'

const url = constants.routes.NON_UK_ADDRESS
const postOptions = {
  url,
  payload: {}
}

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
  })
  describe('POST', () => {
    // Happy paths
    it('should process valid address and redirect to client-email-address if agent and individual', async () => {
      postOptions.payload = {
        addressLine1: 'address line 1',
        addressLine2: 'address line 2',
        addressline3: 'address line 3',
        town: 'town',
        postcode: 'WA4 1HT',
        country: 'country'
      }
      const sessionData = JSON.parse(application.dataString)
      sessionData[constants.redisKeys.IS_AGENT] = 'yes'
      sessionData[constants.redisKeys.CLIENT_INDIVIDUAL_ORGANISATION_KEY] = constants.individualOrOrganisationTypes.INDIVIDUAL
      const response = await submitPostRequest(postOptions, 302, sessionData)
      expect(response.request.response.headers.location).toBe(constants.routes.CLIENTS_EMAIL_ADDRESS)
    })
    it('should process valid address and redirect to upload written authorisation if agent and organisation', async () => {
      postOptions.payload = {
        addressLine1: 'address line 1',
        addressLine2: 'address line 2',
        addressline3: 'address line 3',
        town: 'town',
        postcode: 'WA4 1HT',
        country: 'country'
      }
      const sessionData = JSON.parse(application.dataString)
      sessionData[constants.redisKeys.IS_AGENT] = 'yes'
      sessionData[constants.redisKeys.CLIENT_INDIVIDUAL_ORGANISATION_KEY] = constants.individualOrOrganisationTypes.ORGANISATION
      const response = await submitPostRequest(postOptions, 302, sessionData)
      expect(response.request.response.headers.location).toBe(constants.routes.UPLOAD_WRITTEN_AUTHORISATION)
    })
    it('should process valid address and redirect to check-applicant-information if not agent', async () => {
      postOptions.payload = {
        addressLine1: 'address line 1',
        addressLine2: 'address line 2',
        addressline3: 'address line 3',
        town: 'town',
        postcode: 'WA4 1HT',
        country: 'country'
      }
      const sessionData = JSON.parse(application.dataString)
      sessionData[constants.redisKeys.IS_AGENT] = 'no'
      const response = await submitPostRequest(postOptions, 302, sessionData)
      expect(response.request.response.headers.location).toBe(constants.routes.CHECK_APPLICANT_INFORMATION)
    })
    // Sad paths
    it('should error if address line 1 is empty', async () => {
      postOptions.payload = {
        addressLine1: '',
        addressLine2: 'address line 2',
        addressline3: 'address line 3',
        town: 'town',
        postcode: 'WA4 1HT',
        country: 'country'
      }
      const response = await submitPostRequest(postOptions, 200)
      expect(response.payload).toContain('Enter address line 1')
    })
    it('should error if town is empty', async () => {
      postOptions.payload = {
        addressLine1: 'address line 1',
        addressLine2: 'address line 2',
        addressline3: 'address line 3',
        town: '',
        postcode: 'WA4 1HT',
        country: 'country'
      }
      const response = await submitPostRequest(postOptions, 200)
      expect(response.payload).toContain('Enter town or city')
    })
    it('should error if country is empty', async () => {
      postOptions.payload = {
        addressLine1: 'address line 1',
        addressLine2: 'address line 2',
        addressline3: 'address line 3',
        town: 'town',
        postcode: 'WA4 1HT',
        country: ''
      }
      const response = await submitPostRequest(postOptions, 200)
      expect(response.payload).toContain('Enter country')
    })
    it('should error if postcode is greater than 14 characters', async () => {
      postOptions.payload = {
        addressLine1: 'address line 1',
        addressLine2: 'address line 2',
        addressline3: 'address line 3',
        town: 'town',
        postcode: 'a very long postcode',
        country: ''
      }
      const response = await submitPostRequest(postOptions, 200)
      expect(response.payload).toContain('Postal code must be 14 characters or fewer')
    })
  })
})
