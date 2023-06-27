import { submitGetRequest } from '../helpers/server'
import constants from '../../../utils/constants.js'
import auth from '../../../utils/auth.js'
const url = constants.routes.SIGNIN_CALLBACK

jest.mock('../../../utils/auth.js')

describe('Signin callback handler', () => {
  it('Should redirect to home page when authenticating', async () => {
    auth.authenticate = jest.fn().mockImplementation(() => {
      return {}
    })
    const response = await submitGetRequest({ url }, 302)
    expect(response.headers.location).toEqual('/')
    expect(auth.authenticate).toHaveBeenCalledTimes(1)
  })
})
