import { submitGetRequest } from '../helpers/server'
import constants from '../../../utils/constants.js'

const url = constants.routes.SIGNIN_CALLBACK

describe('Signin callback handler', () => {
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
})
