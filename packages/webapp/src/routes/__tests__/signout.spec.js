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
    sessionData[`${constants.redisKeys.SAVE_APPLICATION_SESSION_ON_SIGNOUT_OR_JOURNEY_CHANGE}`] = true
    const response = await submitGetRequest({ url }, 302, sessionData)
    expect(response.headers.location).toEqual('logout-url')
    expect(auth.logout).toHaveBeenCalledTimes(1)
    expect(auth.getLogoutUrl).toHaveBeenCalledTimes(1)
  })
  it('Should determine the application type from APPLICATION_TYPE if present', async () => {
    auth.getLogoutUrl = jest.fn().mockImplementation(() => {
      return {
        href: 'logout-url'
      }
    })
    const sessionData = {
      [constants.redisKeys.APPLICATION_TYPE]: 'Registration'
    }
    await submitGetRequest({ url }, 302, sessionData)
    expect(auth.getLogoutUrl).toHaveBeenCalledWith('Registration')
  })
  it('Should determine the application type from the referer header if APPLICATION_TYPE is not present', async () => {
    auth.getLogoutUrl = jest.fn().mockImplementation(() => {
      return {
        href: 'logout-url'
      }
    })
    const options = {
      url,
      headers: {
        referer: 'http://localhost:3000/land/test-url'
      }
    }
    await submitGetRequest(options, 302, {})
    expect(auth.getLogoutUrl).toHaveBeenCalledWith('Registration')
  })
})
