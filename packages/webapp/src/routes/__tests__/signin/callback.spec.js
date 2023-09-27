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
  it('Should redirect to the allocations task list when an authenticated allocation user has made no applications', done => {
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
        session.set(constants.redisKeys.PRE_AUTHENTICATION_ROUTE, '/developer/mock-route')

        let redirectArgs = ''
        const h = {
          redirect: (...args) => {
            redirectArgs = args
          }
        }
        const getHandler = callback[0].handler
        await getHandler({ yar: session, query: {} }, h)
        expect(redirectArgs[0]).toEqual(constants.routes.DEVELOPER_TASKLIST)
        expect(auth.authenticate).toHaveBeenCalledTimes(1)
        done()
      } catch (err) {
        done(err)
      }
    })
  })
  it('Should redirect to the registrations task list when an authenticated registration user has made no applications', done => {
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
        session.set(constants.redisKeys.PRE_AUTHENTICATION_ROUTE, '/land/mock-route')

        let redirectArgs = ''
        const h = {
          redirect: (...args) => {
            redirectArgs = args
          }
        }
        const getHandler = callback[0].handler
        await getHandler({ yar: session, query: {} }, h)
        expect(redirectArgs[0]).toEqual(constants.routes.REGISTER_LAND_TASK_LIST)
        expect(auth.authenticate).toHaveBeenCalledTimes(1)
        done()
      } catch (err) {
        done(err)
      }
    })
  })
  it('Should redirect to the allocations dashboard when an authenticated allocation user has one or more associated applications', done => {
    jest.isolateModules(async () => {
      try {
        jest.resetAllMocks()
        jest.mock('../../../utils/http.js')
        const http = require('../../../utils/http.js')
        http.postJson = jest.fn().mockImplementation(() => {
          return [{}]
        })
        auth.authenticate = jest.fn().mockImplementation(() => {
          return {
            idTokenClaims: {
              contactId: 'mock contact id'
            }
          }
        })

        const session = new Session()
        session.set(constants.redisKeys.PRE_AUTHENTICATION_ROUTE, '/developer/mock-route')

        let redirectArgs = ''
        const h = {
          redirect: (...args) => {
            redirectArgs = args
          }
        }
        const getHandler = callback[0].handler
        await getHandler({ yar: session, query: {} }, h)
        expect(redirectArgs[0]).toEqual(constants.routes.DEVELOPER_DEVELOPMENT_PROJECTS)
        expect(auth.authenticate).toHaveBeenCalledTimes(1)
        done()
      } catch (err) {
        done(err)
      }
    })
  })
  it('Should redirect to the registrations dashboard when an authenticated registration user has one or more associated applications', done => {
    jest.isolateModules(async () => {
      try {
        jest.resetAllMocks()
        jest.mock('../../../utils/http.js')
        const http = require('../../../utils/http.js')
        http.postJson = jest.fn().mockImplementation(() => {
          return [{}]
        })
        auth.authenticate = jest.fn().mockImplementation(() => {
          return {
            idTokenClaims: {
              contactId: 'mock contact id'
            }
          }
        })

        const session = new Session()
        session.set(constants.redisKeys.PRE_AUTHENTICATION_ROUTE, '/land/mock-route')

        let redirectArgs = ''
        const h = {
          redirect: (...args) => {
            redirectArgs = args
          }
        }
        const getHandler = callback[0].handler
        await getHandler({ yar: session, query: {} }, h)
        expect(redirectArgs[0]).toEqual(constants.routes.BIODIVERSITY_GAIN_SITES)
        expect(auth.authenticate).toHaveBeenCalledTimes(1)
        done()
      } catch (err) {
        done(err)
      }
    })
  })
})
