import { submitGetRequest } from '../helpers/server'
import constants from '../../../utils/constants.js'
import auth from '../../../utils/auth.js'
import Session from '../../../__mocks__/session.js'
import callback from '../../signin/callback.js'

const url = constants.routes.SIGNIN_CALLBACK

jest.mock('../../../utils/auth.js')
jest.mock('../../../utils/http.js')

describe('Signin callback handler', () => {
  it('Should redirect to the manage biodiversity gains route when the application type associated with an authenticated user is unknown', done => {
    jest.isolateModules(async () => {
      try {
        jest.resetAllMocks()
        jest.mock('../../../utils/http.js')
        const http = require('../../../utils/http.js')
        http.postJson = jest.fn().mockImplementation(() => {
          return []
        })
        auth.authenticate = jest.fn().mockImplementation(() => {
          return {}
        })
        const response = await submitGetRequest({ url }, 302)
        expect(response.headers.location).toEqual(constants.routes.MANAGE_BIODIVERSITY_GAINS)
        expect(auth.authenticate).toHaveBeenCalledTimes(1)
        done()
      } catch (err) {
        done(err)
      }
    })
  })
  it('Should redirect to the manage biodiversity gains route when the application type associated with an authenticated user is not allocation or registration', done => {
    jest.isolateModules(async () => {
      try {
        jest.resetAllMocks()
        jest.mock('../../../utils/http.js')
        const http = require('../../../utils/http.js')
        http.postJson = jest.fn().mockImplementation(() => {
          return []
        })
        auth.authenticate = jest.fn().mockImplementation(() => {
          return {
            idTokenClaims: {
              contactId: 'mock contact id'
            }
          }
        })

        const session = new Session()
        session.set(constants.redisKeys.PRE_AUTHENTICATION_ROUTE, '/mock-route')

        let redirectArgs = ''
        const h = {
          redirect: (...args) => {
            redirectArgs = args
          }
        }
        const getHandler = callback[0].handler
        await getHandler({ yar: session, query: {} }, h)
        expect(redirectArgs[0]).toEqual(constants.routes.MANAGE_BIODIVERSITY_GAINS)
        expect(auth.authenticate).toHaveBeenCalledTimes(1)
        done()
      } catch (err) {
        done(err)
      }
    })
  })

  it('should redirect to the registrations tasklist when an authenticated registration user has one associated applications', done => {
    const mockApplications = [{
      applicationStatus: 'IN PROGRESS',
      applicationReference: 'mock-ref'
    }]
    const preAuthenticationRoute = '/land/mock-route'
    const redirectUrl = constants.routes.REGISTER_LAND_TASK_LIST
    processRedirectionByApplicationType(mockApplications, preAuthenticationRoute, redirectUrl, done)
  })

  it('should redirect to the biodiversity gain sites when an authenticated registration user has more than one associated applications', done => {
    const mockApplications = [{
      applicationStatus: 'IN PROGRESS',
      applicationReference: 'mock-ref-1'
    },
    {
      applicationStatus: 'COMPLETED',
      applicationReference: 'mock-ref-2'
    }]
    const preAuthenticationRoute = '/land/mock-route'
    const redirectUrl = constants.routes.BIODIVERSITY_GAIN_SITES
    processRedirectionByApplicationType(mockApplications, preAuthenticationRoute, redirectUrl, done)
  })

  it('should redirect to the allocation tasklist when an authenticated user has one associated applications', done => {
    const mockApplications = [{
      applicationStatus: 'IN PROGRESS',
      applicationReference: 'mock-ref'
    }]
    const preAuthenticationRoute = '/developer/mock-route'
    const redirectUrl = constants.routes.DEVELOPER_TASKLIST
    processRedirectionByApplicationType(mockApplications, preAuthenticationRoute, redirectUrl, done)
  })

  it('should redirect to the allocation dashboard when an authenticated user has more than one associated applications', done => {
    const mockApplications = [{
      applicationStatus: 'IN PROGRESS',
      applicationReference: 'mock-ref-1'
    },
    {
      applicationStatus: 'COMPLETED',
      applicationReference: 'mock-ref-2'
    }]
    const preAuthenticationRoute = '/developer/mock-route'
    const redirectUrl = constants.routes.DEVELOPER_DEVELOPMENT_PROJECTS
    processRedirectionByApplicationType(mockApplications, preAuthenticationRoute, redirectUrl, done)
  })

  it('should redirect to the registrations tasklist when an authenticated registration user has no or more associated applications', done => {
    const mockApplications = [{}]
    const preAuthenticationRoute = '/land/mock-route'
    const redirectUrl = constants.routes.REGISTER_LAND_TASK_LIST
    processRedirectionByApplicationType(mockApplications, preAuthenticationRoute, redirectUrl, done)
  })

  it('should redirect to the allocation tasklist when an authenticated user has no or more associated applications', done => {
    const mockApplications = [{}]
    const preAuthenticationRoute = '/developer/mock-route'
    const redirectUrl = constants.routes.DEVELOPER_TASKLIST
    processRedirectionByApplicationType(mockApplications, preAuthenticationRoute, redirectUrl, done)
  })
})

const processRedirectionByApplicationType = (applications, preAuthenticationRoute, redirectUrl, done) => {
  jest.isolateModules(async () => {
    try {
      const redirectArgs = await prepareMockHandler(applications, preAuthenticationRoute)

      expect(redirectArgs[0]).toEqual(redirectUrl)
      expect(auth.authenticate).toHaveBeenCalledTimes(1)
      done()
    } catch (err) {
      done(err)
    }
  })
}

const prepareMockHandler = async (applications, preAuthenticationRoute) => {
  jest.resetAllMocks()
  jest.mock('../../../utils/http.js')
  const http = require('../../../utils/http.js')
  http.postJson = jest.fn().mockImplementation(() => applications)
  auth.authenticate = jest.fn().mockImplementation(() => {
    return {
      idTokenClaims: {
        contactId: 'mock contact id'
      }
    }
  })

  const session = new Session()
  session.set(constants.redisKeys.PRE_AUTHENTICATION_ROUTE, preAuthenticationRoute)

  let redirectArgs = ''
  const h = {
    redirect: (...args) => {
      redirectArgs = args
    }
  }
  const getHandler = callback[0].handler
  await getHandler({ yar: session, query: {} }, h)
  return redirectArgs
}
