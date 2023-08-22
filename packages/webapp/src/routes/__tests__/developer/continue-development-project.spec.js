import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = `${constants.routes.DEVELOPER_CONTINUE_DEVELOPMENT_PROJECT}/mock-application-reference`

jest.mock('../../../utils/http.js')

describe(url, () => {
  describe('GET', () => {
    it('should load the development project and redirect to the development project task list page', done => {
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
          expect(response.headers.location).toEqual(constants.routes.DEVELOPER_TASKLIST)
          done()
        } catch (err) {
          done(err)
        }
      })
    })
    it('should redirect to the development project dashboard if the development project does not exist', done => {
      jest.isolateModules(async () => {
        try {
          jest.resetAllMocks()
          jest.mock('../../../utils/http.js')
          const http = require('../../../utils/http.js')
          http.postJson = jest.fn().mockImplementation(() => {
            return {}
          })
          const response = await submitGetRequest({ url }, 302, {}, { expectedNumberOfPostJsonCalls: 1 })
          expect(response.headers.location).toEqual(constants.routes.DEVELOPER_DEVELOPMENT_PROJECTS)
          done()
        } catch (err) {
          done(err)
        }
      })
    })
  })
})
