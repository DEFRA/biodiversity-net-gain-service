import { submitGetRequest } from './helpers/server.js'
import constants from '../../utils/constants.js'
const url = constants.routes.SIGNIN

describe('Signin handler', () => {
  it('Should render a non protected route without authentication', async () => {
    const options = {
      url,
      auth: false
    }
    const response = await submitGetRequest(options, 302)
    expect(response.headers.location).toEqual('signin-url')
  })
  it('Should redirect to next param if authenticated', async () => {
    const options = {
      url: `${url}?next=/start`
    }
    const response = await submitGetRequest(options, 302)
    expect(response.headers.location).toEqual('/start')
  })
})
