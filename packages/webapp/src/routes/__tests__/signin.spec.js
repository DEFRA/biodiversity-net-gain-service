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
  it('Should render a non protected route without authentication that includes a next param', async () => {
    const options = {
      url: `${url}?next=/start`,
      auth: false
    }
    const response = await submitGetRequest(options, 302)
    expect(response.headers.location).toEqual('signin-url')
  })
  it('Should redirect to auth url if reselect is true even if authenticated', async () => {
    const options = {
      url: `${url}?reselect=true`
    }
    const response = await submitGetRequest(options, 302)
    expect(response.headers.location).toEqual('signin-url')
  })
  it('Should error if reselect is not a bool', async () => {
    const options = {
      url: `${url}?reselect=sdfsdfs`
    }
    await submitGetRequest(options, 400)
  })
})
