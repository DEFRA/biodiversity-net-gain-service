import { submitGetRequest } from './helpers/server.js'
import constants from '../../utils/constants.js'
import auth from '../../utils/auth.js'
const url = constants.routes.SIGNOUT

jest.mock('../../utils/auth.js')

describe('Signout handler', () => {
  it('Should render a non protected route without authentication', async () => {
    auth.getLogoutUrl = jest.fn().mockImplementation(() => {
      return {
        href: 'logout-url'
      }
    })
    const response = await submitGetRequest({ url }, 302)
    expect(response.headers.location).toEqual('logout-url')
    expect(auth.logout).toHaveBeenCalledTimes(1)
    expect(auth.getLogoutUrl).toHaveBeenCalledTimes(1)
  })
  it('Should process a signout even if auth.logout fails due to msal cache being blank', async () => {
    auth.getLogoutUrl = jest.fn().mockImplementation(() => {
      return {
        href: 'logout-url'
      }
    })
    auth.logout = jest.fn().mockImplementation(() => {
      throw new Error('test error')
    })
    const response = await submitGetRequest({ url }, 302)
    expect(response.headers.location).toEqual('logout-url')
    expect(auth.logout).toHaveBeenCalledTimes(1)
    expect(auth.getLogoutUrl).toHaveBeenCalledTimes(1)
  })
  it('Should persist journey data if required before signing out', async () => {
    auth.getLogoutUrl = jest.fn().mockImplementation(() => {
      return {
        href: 'logout-url'
      }
    })
    const sessionData = {
    }
    sessionData[`${constants.redisKeys.SAVE_APPLICATION_SESSION_ON_SIGNOUT}`] = true
    const response = await submitGetRequest({ url }, 302, sessionData)
    expect(response.headers.location).toEqual('logout-url')
    expect(auth.logout).toHaveBeenCalledTimes(1)
    expect(auth.getLogoutUrl).toHaveBeenCalledTimes(1)
  })
})
