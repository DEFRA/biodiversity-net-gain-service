import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = `${constants.routes.CONTINUE_REGISTRATION}/mock-application-reference`

jest.mock('../../../utils/http.js')

describe(url, () => {
  describe('GET', () => {
    it('should load the registration and redirect to the register land task list page', done => {
      jest.isolateModules(async () => {
        try {
          jest.resetAllMocks()
          jest.mock('../../../utils/http.js')
          const http = require('../../../utils/http.js')
          http.postJson = jest.fn().mockImplementation(() => {
            return {
              key: 'value'
            }
          })
          const response = await submitGetRequest({ url }, 302, {}, { expectedNumberOfPostJsonCalls: 1 })
          expect(response.headers.location).toEqual(constants.routes.REGISTER_LAND_TASK_LIST)
          done()
        } catch (err) {
          done(err)
        }
      })
    })
    it('should return a HTTP 400 status code if a registration application reference does not exist', done => {
      jest.isolateModules(async () => {
        try {
          jest.resetAllMocks()
          jest.mock('../../../utils/http.js')
          const http = require('../../../utils/http.js')
          http.postJson = jest.fn().mockImplementation(() => {
            return {}
          })
          await submitGetRequest({ url }, 400, null, { expectedNumberOfPostJsonCalls: 1 })
          done()
        } catch (err) {
          done(err)
        }
      })
    })
    it('should return a HTTP 400 status code if the URL does not include a registration application reference', done => {
      jest.isolateModules(async () => {
        try {
          jest.resetAllMocks()
          jest.mock('../../../utils/http.js')
          const http = require('../../../utils/http.js')
          http.postJson = jest.fn().mockImplementation(() => {
            return {}
          })
          await submitGetRequest({ url: url.substring(0, url.lastIndexOf('/') + 1) }, 400)
          done()
        } catch (err) {
          done(err)
        }
      })
    })
  })
})
