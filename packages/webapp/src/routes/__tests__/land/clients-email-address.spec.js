import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.CLIENTS_EMAIL_ADDRESS
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
    it('Should accept a valid email address and continue to clients-phone-number', async () => {
      postOptions.payload.email = 'test@test.com'
      const response = await submitPostRequest(postOptions)
      expect(response.request.response.headers.location).toBe(constants.routes.CLIENTS_PHONE_NUMBER)
    })
    // Sad paths
    it('Should error on invalid email address', async () => {
      postOptions.payload.email = 'kjshdfkjskhfsd'
      const response = await submitPostRequest(postOptions, 200)
      expect(response.payload).toContain('Enter an email address in the correct format, like name@example.com')
    })
    it('Should error on email address too long', async () => {
      postOptions.payload.email = 'test@testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest.com'
      const response = await submitPostRequest(postOptions, 200)
      expect(response.payload).toContain('Email address must be 254 characters or less')
    })
    it('Should error on email address missing', async () => {
      postOptions.payload.email = ''
      const response = await submitPostRequest(postOptions, 200)
      expect(response.payload).toContain('Enter email address')
    })
  })
})
