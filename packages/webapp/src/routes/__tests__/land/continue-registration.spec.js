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
    it('should redirect to the registration dashboard if a registration does not exist', done => {
      jest.isolateModules(async () => {
        try {
          jest.resetAllMocks()
          jest.mock('../../../utils/http.js')
          const http = require('../../../utils/http.js')
          http.postJson = jest.fn().mockImplementation(() => {
            return {}
          })
          const response = await submitGetRequest({ url }, 302, {}, { expectedNumberOfPostJsonCalls: 1 })
          expect(response.headers.location).toEqual(constants.routes.BIODIVERSITY_GAIN_SITES)
          done()
        } catch (err) {
          done(err)
        }
      })
    })
  })
})
