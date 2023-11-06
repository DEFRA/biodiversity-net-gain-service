import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.CLIENTS_PHONE_NUMBER
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
    //happy path
    it('Should accept a valid phone number and continue to upload-written-authorisation', async () => {
      postOptions.payload.phone = '01234567890'
      const response = await submitPostRequest(postOptions)
      expect(response.request.response.headers.location).toBe(constants.routes.UPLOAD_WRITTEN_AUTHORISATION)
    })
    //sad paths
    it('Should error if no phone number given', async () => {
      postOptions.payload.phone = ''
      const response = await submitPostRequest(postOptions, 200)
      expect(response.payload).toContain('Enter a phone number')
    })
    // it('Should error if no phone number given', async () => {
    //   postOptions.payload.phone = 'sdfsdfsfds'
    //   const response = await submitPostRequest(postOptions, 200)
    //   expect(response.payload).toContain('Enter a phone number, like 01632 960 001, 07700 900 982 or +44 808 157 0192')
    // })
  })
})
