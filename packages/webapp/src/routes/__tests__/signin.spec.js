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
  it('Should redirect to the manage biodiversity gains view when authenticated and the developer journey is enabled', async () => {
    process.env.ENABLE_ROUTE_SUPPORT_FOR_DEV_JOURNEY = 'Y'
    const options = {
      url
    }
    const response = await submitGetRequest(options, 302)
    expect(response.headers.location).toEqual(constants.routes.MANAGE_BIODIVERSITY_GAINS)
  })
  it('Should redirect to the regisrations dashboard when authenticated and the developer journey is not enabled', async () => {
    process.env.ENABLE_ROUTE_SUPPORT_FOR_DEV_JOURNEY = 'N'
    const options = {
      url
    }
    const response = await submitGetRequest(options, 302)
    expect(response.headers.location).toEqual(constants.routes.BIODIVERSITY_GAIN_SITES)
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
