import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import addGridReference from '../../land/add-grid-reference.js'
import Session from '../../../__mocks__/session.js'
import constants from '../../../utils/constants'
const url = constants.routes.ADD_GRID_REFERENCE
jest.mock('../../../utils/http.js')

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
  })
  describe('POST', () => {
    let postOptions
    const sessionData = {}
    beforeEach(() => {
      postOptions = {
        url,
        payload: {}
      }
      sessionData[constants.redisKeys.APPLICATION_TYPE] = constants.applicationTypes.REGISTRATION
    })
    it('should continue journey if valid grid reference is entered inside of England', async () => {
      jest.resetAllMocks()
      jest.mock('../../../utils/http.js')
      const http = require('../../../utils/http.js')
      http.postJson = jest.fn().mockImplementation(() => {
        return {
          isPointInEngland: true
        }
      })
      postOptions.payload.gridReference = 'SL123456'
      await submitPostRequest(postOptions, 302, sessionData, { expectedNumberOfPostJsonCalls: 2 })
    })
    it('should fail journey if valid grid reference outside of England is entered', async () => {
      jest.resetAllMocks()
      jest.mock('../../../utils/http.js')
      const http = require('../../../utils/http.js')
      http.postJson = jest.fn().mockImplementation(() => {
        return {
          isPointInEngland: false
        }
      })
      postOptions.payload.gridReference = 'SL123456'
      const res = await submitPostRequest(postOptions, 200, sessionData, { expectedNumberOfPostJsonCalls: 1 })
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Grid reference must be in England')
    })
    it('should show appropriate error if grid reference is empty', async () => {
      postOptions.payload.gridReference = ''
      const res = await submitPostRequest(postOptions, 200, sessionData)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Enter the grid reference')
    })
    it('should show appropriate error if grid reference is too short', async () => {
      postOptions.payload.gridReference = 'SK'
      const res = await submitPostRequest(postOptions, 200, sessionData)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Grid reference must be between 6 and 14 characters')
    })
    it('should show appropriate error if grid reference is too long', async () => {
      postOptions.payload.gridReference = 'SK12345678901234567890'
      const res = await submitPostRequest(postOptions, 200, sessionData)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Grid reference must be between 6 and 14 characters')
    })
    it('should show appropriate error if grid reference is not a valid grid reference', async () => {
      postOptions.payload.gridReference = 'ZZ9999999999'
      const res = await submitPostRequest(postOptions, 200, sessionData)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Grid reference must start with two letters, followed by only numbers and spaces, like SE 170441')
    })
    it('Ensure page uses referer if is set on post and hectares is present', done => {
      jest.isolateModules(async () => {
        try {
          jest.resetAllMocks()
          jest.mock('../../../utils/http.js')
          const http = require('../../../utils/http.js')
          http.postJson = jest.fn().mockImplementation(() => {
            return {
              isPointInEngland: true
            }
          })
          const postHandler = addGridReference[1].handler
          const session = new Session()
          session.set(constants.redisKeys.REFERER, constants.routes.CHECK_AND_SUBMIT)
          session.set(constants.redisKeys.LAND_BOUNDARY_HECTARES, 2)
          session.set(constants.redisKeys.APPLICATION_TYPE, constants.applicationTypes.REGISTRATION)
          const payload = {
            gridReference: 'ST123456'
          }
          let viewArgs = ''
          let redirectArgs = ''
          const h = {
            view: (...args) => {
              viewArgs = args
            },
            redirect: (...args) => {
              redirectArgs = args
            }
          }

          await postHandler({ payload, yar: session, path: addGridReference[1].path }, h)
          expect(viewArgs).toEqual('')
          expect(redirectArgs[0]).toEqual(constants.routes.CHECK_AND_SUBMIT)
          done()
        } catch (err) {
          done(err)
        }
      })
    })
    it('Ensure page doesn\'t use referer if is set on post and grid reference is missing', done => {
      jest.isolateModules(async () => {
        try {
          jest.resetAllMocks()
          jest.mock('../../../utils/http.js')
          const http = require('../../../utils/http.js')
          http.postJson = jest.fn().mockImplementation(() => {
            return {
              isPointInEngland: true
            }
          })
          const postHandler = addGridReference[1].handler
          const session = new Session()
          session.set(constants.redisKeys.REFERER, constants.routes.CHECK_AND_SUBMIT)
          session.set(constants.redisKeys.APPLICATION_TYPE, constants.applicationTypes.REGISTRATION)
          const payload = {
            gridReference: 'ST123456'
          }
          let viewArgs = ''
          let redirectArgs = ''
          const h = {
            view: (...args) => {
              viewArgs = args
            },
            redirect: (...args) => {
              redirectArgs = args
            }
          }

          await postHandler({ payload, yar: session, path: addGridReference[1].path }, h)
          expect(viewArgs).toEqual('')
          expect(redirectArgs[0]).toEqual(constants.routes.ADD_HECTARES)
          done()
        } catch (err) {
          done(err)
        }
      })
    })
  })
})
